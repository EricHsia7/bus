const { Compilation, sources } = require('webpack');
const acorn = require('acorn');
const MagicString = require('magic-string');

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
          for (const [name, source] of Object.entries(assets)) {
            if (!name.endsWith('.js')) continue;

            const code = source.source();
            const s = new MagicString(code);
            const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });

            this.walk(ast, (node) => {
              if (this.isErrorThrow(node)) {
                const arg = node.argument.arguments[0];
                const originalText = code.slice(arg.start, arg.end);

                // Get or create error code
                if (!this.mapping.has(originalText)) {
                  this.mapping.set(originalText, `${this.prefix}${this.counter++}`);
                }

                const errorCode = this.mapping.get(originalText);

                // Overwrite only the argument part: keep 'throw new Error()' intact
                // We keep original arguments if they are variables
                s.overwrite(arg.start, arg.end, `'${errorCode}'`);
              }
            });

            // Replace the asset with the modified version
            compilation.updateAsset(name, new sources.RawSource(s.toString()));
          }

          // Output the mapping for your logs/Sentry
          this.saveManifest(compilation);
        }
      );
    });
  }

  isErrorThrow(node) {
    return node.type === 'ThrowStatement' && node.argument.type === 'NewExpression' && node.argument.callee.name === 'Error';
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

  saveManifest(compilation) {
    const json = JSON.stringify(Object.fromEntries(this.mapping), null, 2);
    compilation.emitAsset('error-map.json', new sources.RawSource(json));
  }
}

module.exports = {
  ErrorCodePlugin
};
