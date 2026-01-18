const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
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

// Array to store HTML code for the links to splash screen images
const htmlLinks = [];

// Function to process a single device image
async function processDeviceImage(deviceInfo, iconImage, backgroundImage) {
  const canvasWidth = deviceInfo.width * deviceInfo.scale;
  const canvasHeight = deviceInfo.height * deviceInfo.scale;
  const iconWidth = Math.max(Math.min(canvasWidth * 0.45, 160), 50) * deviceInfo.scale;
  const fileName = `${md5(deviceInfo.name)}@${deviceInfo.scale}x`;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Draw the background image onto the canvas
  ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

  // Draw the icon image in the center of the canvas
  ctx.drawImage(iconImage, canvasWidth / 2 - iconWidth / 2, canvasHeight / 2 - iconWidth / 2, iconWidth, iconWidth);

  const outputFilePath = `${outputDir}/${fileName}.png`;

  const outputStream = fs.createWriteStream(outputFilePath);
  const pngStream = canvas.createPNGStream();
  pngStream.pipe(outputStream);

  // Wait for the image to finish writing, then add a link to the HTML links array
  await new Promise((resolve) => {
    outputStream.on('finish', () => {
      htmlLinks.push(`<link rel="apple-touch-startup-image" href="./${assetName}/${fileName}.png" media="(device-width: ${deviceInfo.width}px) and (device-height: ${deviceInfo.height}px) and (-webkit-device-pixel-ratio: ${deviceInfo.scale})"/>`);
      resolve();
    });
  });
}

async function main() {
  const outputDirCreation = await makeDirectory(outputDir);
  if (outputDirCreation === 1) {
    const iconPath = './icons/transparent.png';
    const bgPath = './icons/bg.png';
    const iconImage = await loadImage(iconPath);
    const backgroundImage = await loadImage(bgPath);
    for (const deviceInfo of deviceData.data) {
      await processDeviceImage(deviceInfo, iconImage, backgroundImage);
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
