const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');
const { Jimp } = require('jimp');
const md5 = require('md5');

// Array of device data containing information about various devices and their dimensions
const deviceData = require('./splash-screen-device-data.json');
const assetName = 'splash-screen';
const outputDir = `./dist/${assetName}`;

async function makeDirectory(path) {
  // Check if the path already exists
  try {
    await fs.promises.access(path);
    return 0;
  } catch (error) {
    // If there is an error, it means the path does not exist
    // Try to create the directory
    try {
      await fs.promises.mkdir(path, { recursive: true });
      return 1;
    } catch (error) {
      process.exit(1);
      return -1;
    }
  }
}

async function writeTextFile(path, content) {
  try {
    await fs.promises.writeFile(path, content, { encoding: 'utf8' });
    return `File "${path}" created successfully!`;
  } catch (err) {
    throw new Error(`Error creating file: ${err.message}`);
  }
}

function shortenHex(hex) {
  const CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const BASE = 62n;
  let num = BigInt('0x' + hex);
  if (num === 0n) return '0';
  let result = '';
  while (num > 0n) {
    const remainder = num % BASE;
    result = CHARSET[Number(remainder)] + result;
    num = num / BASE;
  }
  return result;
}

// Array to store HTML code for the links to splash screen images
const htmlLinks = [];

async function rasterize(svgText, outputPath, width, height, scale) {
  const svg = Buffer.from(svgText, 'utf-8');
  const options = {
    fitTo: {
      mode: 'width',
      value: width * scale
    }
  };
  const resvg = new Resvg(svg, options);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const resizedImage = await Jimp.fromBuffer(pngBuffer);
  resizedImage.resize({ w: width, h: height });
  await resizedImage.write(outputPath);
}

async function main() {
  const outputDirCreation = await makeDirectory(outputDir);
  if (outputDirCreation === 1) {
    for (const deviceInfo of deviceData.data) {
      const iconSize = Math.max(Math.min(deviceInfo.width * 0.4, 160), 50);
      const width = deviceInfo.width;
      const height = deviceInfo.height;
      const scale = deviceInfo.scale;
      const svgText = `<svg stroke-miterlimit="10" style="fill-rule: nonzero; clip-rule: evenodd; stroke-linecap: round; stroke-linejoin: round" version="1.1" viewBox="0 0 ${width} ${height}" xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect x="0" y="0" width="${width}" height="${height}" fill="#329cff" />
  <g width="64" height="64" transform="translate(${width / 2 - iconSize / 2} ${height / 2 - iconSize / 2}) scale(${iconSize / 64} ${iconSize / 64})">
    <path d="M22.7188 11.4375C18.5066 11.4375 15.0938 14.8504 15.0938 19.0625C15.0938 19.6458 15.0937 41.8495 15.0938 42.0625C15.0938 45.3807 17.3025 48.2326 20.4063 49.25L20.4063 50.6875C20.4063 51.7241 21.2447 52.5625 22.2813 52.5625C23.3178 52.5625 24.1563 51.7241 24.1563 50.6875L24.1563 49.6875L39.8438 49.6875L39.8438 50.6875C39.8437 51.7241 40.6822 52.5625 41.7188 52.5625C42.7553 52.5625 43.5938 51.7241 43.5938 50.6875L43.5938 49.25C46.6975 48.2326 48.9062 45.3807 48.9063 42.0625L48.9063 19.0625C48.9063 14.8504 45.4934 11.4375 41.2813 11.4375C40.7007 11.4375 23.2993 11.4375 22.7188 11.4375ZM22.7188 14.3125L41.2813 14.3125C43.9088 14.3125 46.0312 16.435 46.0313 19.0625L46.0313 30.1563C46.0313 30.8296 45.4858 31.375 44.8125 31.375L19.1875 31.375C18.5142 31.375 17.9687 30.8296 17.9688 30.1563C17.9688 29.5719 17.9688 19.6458 17.9688 19.0625C17.9688 16.435 20.0912 14.3125 22.7188 14.3125ZM19.1875 34.25L44.8125 34.25C45.4858 34.25 46.0312 34.7954 46.0313 35.4688L46.0313 42.0625C46.0313 44.69 43.9088 46.8438 41.2813 46.8438L22.7188 46.8438C20.0912 46.8438 17.9687 44.69 17.9688 42.0625C17.9688 41.8495 17.9688 35.912 17.9688 35.4688C17.9688 34.7954 18.5142 34.25 19.1875 34.25ZM23.1563 37.75C21.6311 37.75 20.4063 38.9749 20.4063 40.5C20.4063 42.0251 21.6311 43.25 23.1563 43.25C24.6814 43.25 25.9063 42.0251 25.9063 40.5C25.9063 38.9749 24.6814 37.75 23.1563 37.75ZM40.8438 37.75C39.3186 37.75 38.0938 38.9749 38.0938 40.5C38.0938 42.0251 39.3186 43.25 40.8438 43.25C42.3689 43.25 43.5938 42.0251 43.5938 40.5C43.5938 38.9749 42.3689 37.75 40.8438 37.75Z" fill-rule="nonzero" opacity="1" stroke="none" fill="#fff"/>
  </g>
</svg>`;
      const fileName = shortenHex(md5(`${deviceInfo.name}@${deviceInfo.scale}x`));
      const outputFilePath = `${outputDir}/${fileName}.png`;
      await rasterize(svgText, outputFilePath, width * scale, height * scale, 3); // supersampling: 3x
    }
    await writeTextFile(`${outputDir}/html.json`, JSON.stringify({ html: htmlLinks.join('\n') }));
    console.log('Successfully generated splash screens and HTML code.');
  } else if (outputDirCreation === 0) {
    console.log('Using cached splash screens and HTML code.');
  } else {
    process.exit(1);
  }
  process.exit(0);
}

main();
