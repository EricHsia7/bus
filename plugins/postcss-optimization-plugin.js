const { Compilation, sources } = require('webpack');
const postcss = require('postcss');

class PostCssOptimizationPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const pluginName = 'PostCssOptimizationPlugin';

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE
        },
        async (assets) => {
          for (const [pathname, source] of Object.entries(assets)) {
            if (!pathname.endsWith('.css')) continue;

            try {
              const result = await postcss(this.options.plugins || []).process(source);

              // Update the asset in the compilation
              compilation.updateAsset(pathname, result.css);
            } catch (error) {
              console.error(`PostCSS Error in ${pathname}:`, error);
              compilation.errors.push(error);
            }
          }
        }
      );
    });
  }
}

module.exports = {
  PostCssOptimizationPlugin
};
