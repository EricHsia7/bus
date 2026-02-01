const { Compilation, sources } = require('webpack');
const acorn = require('acorn');
const MagicString = require('magic-string');
const path = require('path');
const { SourceMapSource } = require('webpack-sources');

class ErrorCodePlugin {
  constructor(options = {}) {
    this.mapping = new Map(); // [Original String -> Code]
    this.prefix = options.prefix || 'E';
    this.counter = 0;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ErrorCodePlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ErrorCodePlugin',
          // This stage runs AFTER tree shaking and optimization
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE
        },
        (assets) => {
          for (const [pathname, source] of Object.entries(assets)) {
            if (!pathname.endsWith('.js')) continue;

            const { source: originalSource, map: originalMap } = compilation.getAsset(pathname).source.sourceAndMap();

            const code = source.source();
            const s = new MagicString(code);
            const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
            const newMap = s.generateMap({
              source: pathname,
              includeContent: true,
              hires: true
            });
            this.walk(ast, (node) => {
              if (this.isNewError(node) || this.isNewTypeError(node)) {
                const arg = node.arguments[0];
                const originalText = code.slice(arg.start, arg.end);

                // Get or create error code
                if (!this.mapping.has(originalText)) {
                  this.mapping.set(originalText, `${this.prefix}${this.counter++}`);
                }

                const errorCode = this.mapping.get(originalText);

                // Overwrite only the argument part
                // We keep original arguments if they are variables
                s.overwrite(arg.start, arg.end, `'${errorCode}'`);
              }
            });

            // Replace the asset with the modified version

            compilation.updateAsset(
              pathname,
              new SourceMapSource(
                s.toString(), // The modified code
                pathname, // The filename
                newMap, // The map for specific changes
                originalSource, // The code before changes
                originalMap, // The map before changes
                true // Remove original source from the map? (usually true for production)
              )
            );

            // Output the mapping
            this.saveManifest(compilation, pathname);
          }
        }
      );
    });
  }

  isNewError(node) {
    return node.type === 'NewExpression' && node.callee.type === 'Identifier' && node.callee.name === 'Error';
  }

  isNewTypeError(node) {
    return node.type === 'NewExpression' && node.callee.type === 'Identifier' && node.callee.name === 'TypeError';
  }

  walk(node, callback) {
    callback(node);
    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        if (Array.isArray(node[key])) {
          node[key].forEach((child) => this.walk(child, callback));
        } else if (node[key].type) {
          this.walk(node[key], callback);
        }
      }
    }
  }

  saveManifest(compilation, pathname) {
    const json = JSON.stringify(Object.fromEntries(this.mapping));
    const extension = path.extname(pathname);
    const base = path.basename(pathname, extension);
    const dir = path.dirname(pathname);
    const fullPath = path.join(dir, `${base}.erm`);
    compilation.emitAsset(fullPath, new sources.RawSource(json));
  }
}

module.exports = {
  ErrorCodePlugin
};
