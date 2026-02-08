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
          // Filter for CSS files
          const cssAssets = Object.keys(assets).filter((filename) => filename.endsWith('.css'));

          await Promise.all(
            cssAssets.map(async (filename) => {
              const asset = assets[filename];
              const originalCss = asset.source();

              try {
                // Process with PostCSS
                const result = await postcss(this.options.plugins || []).process(originalCss, {
                  from: filename,
                  to: filename,
                  map: { annotation: false } // Handle sourcemaps if needed
                });

                // Update the asset in the compilation
                compilation.updateAsset(filename, new sources.RawSource(result.css));
              } catch (error) {
                console.error(`PostCSS Error in ${filename}:`, error);
                compilation.errors.push(error);
              }
            })
          );
        }
      );
    });
  }
}

module.exports = {
  PostCssOptimizationPlugin
};
