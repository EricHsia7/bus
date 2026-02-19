const path = require('path');

function formatSize(contentLength) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;

  while (contentLength >= 1000 && i < units.length - 1) {
    contentLength /= 1000;
    i++;
  }

  return `${Math.floor(contentLength * 100) / 100} ${units[i]}`;
}

class BundleStatsMarkdownPlugin {
  constructor(options = {}) {
    // Default options
    this.options = {
      filename: 'README.md',
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
          let categories = {};
          let totalSize = 0;

          // Iterate through assets and gather stats
          for (const [pathname, source] of Object.entries(assets)) {
            const asset = compilation.getAsset(pathname);
            const extension = path.extname(pathname);
            const base = path.basename(pathname, extension);
            const size = asset.source.size(); // bytes
            if (!categories.hasOwnProperty(extension)) {
              categories[extension] = {
                totalSize: 0,
                files: []
              };
            }

            categories[extension].files.push([base, size]);
            categories[extension].totalSize += size;

            totalSize += size;
          }

          const details = [];
          for (const extension in categories) {
            const entries = [];
            categories[extension].files.sort(function (a, b) {
              return b[1] - a[1];
            });
            for (const file of categories[extension].files) {
              entries.push(`- [${formatSize(file[1])}] **${file[0]}${extension}**`);
            }
            details.push([`<details>\n<summary>[${formatSize(categories[extension].totalSize)}] <b>*${extension}</b></summary>\n\n${entries.join('\n')}\n</details>`]);
          }

          const markdownContent = `# ${this.options.title}\n\n[${formatSize(totalSize)}] **\\*.\\***\n${details.join('\n')}`;

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
