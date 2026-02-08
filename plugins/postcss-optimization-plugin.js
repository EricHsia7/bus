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

            const { source: originalSource, map: originalMap } = compilation.getAsset(pathname).source.sourceAndMap();

            try {
              const { css: newCSS, map: newMap } = await postcss(this.options.plugins || []).process(source, {
                from: pathname,
                to: pathname,
                map: {
                  inline: false
                }
              });

              // Update the asset in the compilation
              compilation.updateAsset(
                pathname,
                new SourceMapSource(
                  newCSS, // The modified css
                  pathname, // The filename
                  newMap, // The map for specific changes
                  originalSource, // The code before changes
                  originalMap, // The map before changes
                  true // Remove original source from the map? (usually true for production)
                )
              );
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
