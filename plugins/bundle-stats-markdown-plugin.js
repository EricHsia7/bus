const path = require('path');

class BundleStatsMarkdownPlugin {
  constructor(options = {}) {
    // Default options
    this.options = {
      filename: 'bundle-stats.md',
      title: 'Bundle Statistics',
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'MarkdownStatsPlugin';

    // Hook into the compilation process
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // Tap into the asset processing stage (Webpack 5 specific)
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT
        },
        (assets) => {
          let totalSize = 0;
          let markdownContent = `# ${this.options.title}\n\n`;
          markdownContent += `Generated on: ${new Date().toLocaleString()}\n\n`;

          // Create the table header
          markdownContent += `| File Name | Size (KB) |\n`;
          markdownContent += `| --- | --- |\n`;

          // Iterate through assets and gather stats
          for (const [pathname, source] of Object.entries(assets)) {
            const asset = compilation.getAsset(pathname);

            const extension = path.extname(pathname);
            const base = path.basename(pathname, extension);

            const sizeInBytes = asset.source.size();
            const sizeInKB = (sizeInBytes / 1000).toFixed(2);

            totalSize += sizeInBytes;
            markdownContent += `| \`${base}\` | ${sizeInKB} KB |\n`;
          }

          // Add a total summary footer
          const totalSizeInKB = (totalSize / 1000).toFixed(2);
          markdownContent += `\n**Total Bundle Size:** ${totalSizeInKB} KB\n`;

          // Emit the new markdown file to the build output
          compilation.emitAsset(this.options.filename, new compiler.webpack.sources.RawSource(markdownContent));
        }
      );
    });
  }
}

module.exports = {
  BundleStatsMarkdownPlugin
};
