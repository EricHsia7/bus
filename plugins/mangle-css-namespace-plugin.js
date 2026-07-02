const { RawSource, ReplaceSource, SourceMapSource } = require('webpack-sources'); // one module instance

const PLUGIN = 'MangleCssNamespacePlugin';
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Deterministic, collision-resistant short-name generator.
// Same input set => same output names (stable across builds).
const START = 'abcdefghijklmnopqrstuvwxyz'; // valid ident start
const CONT = START + '0123456789'; // valid ident continuation

class NameGenerator {
  constructor({ prefix = '', reserved = new Set() } = {}) {
    this.prefix = prefix;
    this.reserved = reserved;
    this.map = new Map(); // original -> mangled
    this.counter = 0;
  }

  _encode(n) {
    let name = START[n % START.length];
    n = Math.floor(n / START.length);
    while (n > 0) {
      name += CONT[n % CONT.length];
      n = Math.floor(n / CONT.length);
    }
    return name;
  }

  get(original) {
    const cached = this.map.get(original);
    if (cached) return cached;
    let mangled;
    do {
      mangled = this.prefix + this._encode(this.counter++);
    } while (this.reserved.has(mangled));
    this.map.set(original, mangled);
    return mangled;
  }
}

class MangleCssNamespacePlugin {
  constructor(opts = {}) {
    this.opts = {
      prefixes: ['css_', 'b-cssvar-'],
      newNamePrefix: '',
      emitManifest: true,
      manifestFilename: 'css-mangle-manifest.json',
      test: /\.(css|js|mjs|cjs|html)$/,
      reserved: [],
      htmlPlugin: null, // optionally pass your HtmlWebpackPlugin class
      ...opts
    };
    this.gen = null; // persists across compilations for stable names
  }

  apply(compiler) {
    const { Compilation } = compiler.webpack;
    const HtmlWebpackPlugin = this._resolveHtmlPlugin(compiler);

    compiler.hooks.thisCompilation.tap(PLUGIN, (compilation) => {
      let namespaceMap = null;
      const ensureNamespaceMap = () => (namespaceMap = namespaceMap || this._buildMap(compilation));

      compilation.hooks.processAssets.tapPromise(
        {
          name: PLUGIN,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE
        },
        async (assets) => {
          const namespaceMap = ensureNamespaceMap();
          if (!namespaceMap.size) return;

          for (const [pathname, source] of Object.entries(assets)) {
            if (!this.opts.test.test(pathname)) continue;

            const { source: originalSource, map: originalMap } = compilation.getAsset(pathname).source.sourceAndMap();

            this._rewriteAsset(compilation, pathname, source, originalSource, originalMap, namespaceMap);
          }

          if (this.opts.emitManifest) {
            const json = JSON.stringify(Object.fromEntries(namespaceMap), null, 2);
            compilation.emitAsset(this.opts.manifestFilename, new RawSource(json));
          }
        }
      );

      // HtmlWebpackPlugin output: NOT in compilation.assets yet, so hook its own pipeline. beforeEmit exposes the final `index.html` string.
      if (HtmlWebpackPlugin && typeof HtmlWebpackPlugin.getHooks === 'function') {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(PLUGIN, (data, cb) => {
          try {
            const m = ensureNamespaceMap();
            if (m.size && data && typeof data.html === 'string') {
              data.html = this._rewriteString(data.html, m);
            }
          } catch (err) {
            compilation.warnings.push(err);
          }
          cb(null, data);
        });
      }
    });
  }

  // Grab the exact HtmlWebpackPlugin class the user configured (version-safe),
  // then fall back to an explicit option or a plain require.
  _resolveHtmlPlugin(compiler) {
    if (this.opts.htmlPlugin) return this.opts.htmlPlugin;
    const fromConfig = (compiler.options.plugins || []).map((p) => p && p.constructor).find((c) => c && c.name === 'HtmlWebpackPlugin' && typeof c.getHooks === 'function');
    if (fromConfig) return fromConfig;
    try {
      return require('html-webpack-plugin');
    } catch {
      return null;
    }
  }

  _matchingAssets(compilation) {
    return Object.keys(compilation.assets).filter((f) => this.opts.test.test(f));
  }

  _discoveryRe() {
    const alt = this.opts.prefixes.map(escapeRe).join('|');
    return new RegExp(`(?:${alt})[A-Za-z0-9_-]*`, 'g'); // non-capturing prefix
  }

  // Deterministic name map, discovered from the CSS/JS already in the compilation.
  // HTML is intentionally NOT a discovery source: names used there must be defined
  // in CSS/JS anyway, and we only ever apply mappings that already exist.
  _buildMap(compilation) {
    const re = this._discoveryRe();
    const found = new Set();
    for (const file of this._matchingAssets(compilation)) {
      const src = compilation.assets[file].source().toString();
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(src))) found.add(m[0]);
    }
    this.gen =
      this.gen ||
      new NameGenerator({
        prefix: this.opts.newNamePrefix,
        reserved: new Set(this.opts.reserved)
      });
    for (const name of [...found].sort()) this.gen.get(name);
    return this.gen.map;
  }

  _getTokenRegex(map) {
    const names = [...map.keys()]
      .sort((a, b) => b.length - a.length) // longest first -> avoid incomplete substring replacement (ex: foo_bar, foo)
      .map(escapeRe);
    return new RegExp(`(?<![A-Za-z0-9_-])(--)?(${names.join('|')})(?![A-Za-z0-9_-])`, 'g');
  }

  // Pure string rewrite — used for HtmlWebpackPlugin's data.html
  _rewriteString(raw, map) {
    if (!map.size) return raw;
    return raw.replace(this._getTokenRegex(map), (whole, dashes, name) => {
      const mangled = map.get(name);
      return mangled ? `${dashes || ''}${mangled}` : whole;
    });
  }

  // CSS / JS / HTML assets: one dictionary-based, coordinate-safe pass over a snapshot.
  // Works uniformly because the tokens are reserved, language-agnostic namespaces — selectors, var(), shorthand values, @keyframes, @property, and attribute selectors are all just "the exact token appears here".
  _rewriteAsset(compilation, pathname, source, originalSource, originalMap, namespaceMap) {
    const raw = source.source().toString();
    const re = this._getTokenRegex(namespaceMap);
    const output = new ReplaceSource(source);
    let m;
    let changed = false;
    while ((m = re.exec(raw))) {
      const dashes = m[1] || '';
      const name = m[2];
      const mangled = namespaceMap.get(name);
      if (!mangled) continue;
      const start = m.index + dashes.length;
      const end = start + name.length - 1; // inclusive (webpack-sources)
      output.replace(start, end, mangled);
      changed = true;
    }
    if (changed) {
      compilation.updateAsset(
        pathname,
        new SourceMapSource(
          output.source().toString(), // The modified code
          pathname, // The filename
          source.sourceAndMap().map, // The map for specific changes
          originalSource, // The code before changes
          originalMap, // The map before changes
          true // Remove original source from the map? (usually true for production)
        )
      );
    }
  }
}

module.exports = {
  MangleCssNamespacePlugin
};
