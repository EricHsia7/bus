const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const md5 = require('md5');

// Array of device data containing information about various devices and their dimensions
const deviceData = [
  { name: `iPhone 17`, width: 393, height: 852, scale: 3 },
  { name: `iPhone 17 Air`, width: 391, height: 844, scale: 3 },
  { name: `iPhone 17 Pro`, width: 402, height: 874, scale: 3 },
  { name: `iPhone 17 Pro Max`, width: 440, height: 954, scale: 3 },
  { name: `iPad 11th gen`, width: 810, height: 1180, scale: 2 },
  { name: `iPad Air (11-inch, 7th gen)`, width: 820, height: 1180, scale: 2 },
  { name: `iPad Air (13-inch, 7th gen)`, width: 920, height: 1290, scale: 2 },
  { name: `iPad Pro (11-inch, 5th gen)`, width: 834, height: 1194, scale: 2 },
  { name: `iPad Pro (13-inch, 5th gen)`, width: 1032, height: 1376, scale: 2 },
  { name: `iPad Pro (11-inch, 6th gen)`, width: 834, height: 1194, scale: 2 },
  { name: `iPad Pro (13-inch, 6th gen)`, width: 1032, height: 1376, scale: 2 },
  { name: `iPad Mini (7th gen)`, width: 744, height: 1133, scale: 2 },
  { name: 'iPhone 16e', width: 375, height: 812, scale: 2 },
  { name: `iPhone 16 Pro Max`, width: 440, height: 956, scale: 3 },
  { name: `iPhone 16 Pro`, width: 402, height: 874, scale: 3 },
  { name: `iPhone 16 Plus`, width: 430, height: 932, scale: 3 },
  { name: `iPhone 16`, width: 393, height: 852, scale: 3 },
  { name: `iPhone 15 Pro Max`, width: 430, height: 932, scale: 3 },
  { name: `iPhone 15 Pro`, width: 393, height: 852, scale: 3 },
  { name: `iPhone 15 Plus`, width: 430, height: 932, scale: 3 },
  { name: `iPhone 15`, width: 393, height: 852, scale: 3 },
  { name: `Apple Watch Ultra 2`, width: 205, height: 251, scale: 2 },
  { name: `Apple Watch Series 9 Large`, width: 198, height: 242, scale: 2 },
  { name: `Apple Watch Series 9 Small`, width: 176, height: 215, scale: 2 },
  { name: `iPad Pro (6th gen 12.9")`, width: 1024, height: 1366, scale: 2 },
  { name: `iPad Pro (6th gen 11")`, width: 834, height: 1194, scale: 2 },
  { name: `iPad 10th gen`, width: 820, height: 1180, scale: 2 },
  { name: `iPhone 14 Plus`, width: 428, height: 926, scale: 3 },
  { name: `Apple Watch Ultra`, width: 205, height: 251, scale: 2 },
  { name: `iPhone 14 Pro Max`, width: 430, height: 932, scale: 3 },
  { name: `iPhone 14 Pro`, width: 393, height: 852, scale: 3 },
  { name: `iPhone 14`, width: 390, height: 844, scale: 3 },
  { name: `Apple Watch Series 8 Large`, width: 198, height: 242, scale: 2 },
  { name: `Apple Watch Series 8 Small`, width: 176, height: 215, scale: 2 },
  { name: `Apple Watch SE (2nd) Large`, width: 184, height: 224, scale: 2 },
  { name: `Apple Watch SE (2nd) Small`, width: 162, height: 197, scale: 2 },
  { name: `iPhone SE 3rd gen`, width: 375, height: 667, scale: 2 },
  { name: `iPad Air (5th gen)`, width: 820, height: 1180, scale: 2 },
  { name: `Apple Watch Series 7 Large`, width: 198, height: 242, scale: 2 },
  { name: `Apple Watch Series 7 Small`, width: 176, height: 215, scale: 2 },
  { name: `iPad Mini (6th gen)`, width: 744, height: 1133, scale: 2 },
  { name: `iPhone 13`, width: 390, height: 844, scale: 3 },
  { name: `iPhone 13 mini`, width: 375, height: 812, scale: 3 },
  { name: `iPhone 13 Pro Max`, width: 428, height: 926, scale: 3 },
  { name: `iPhone 13 Pro`, width: 390, height: 844, scale: 3 },
  { name: `iPad 9th gen`, width: 810, height: 1080, scale: 2 },
  { name: `iPad Pro (5th gen 12.9")`, width: 1024, height: 1366, scale: 2 },
  { name: `iPad Pro (5th gen 11")`, width: 834, height: 1194, scale: 2 },
  { name: `iPad Air (4th gen)`, width: 820, height: 1180, scale: 2 },
  { name: `iPhone 12`, width: 390, height: 844, scale: 3 },
  { name: `iPhone 12 mini`, width: 375, height: 812, scale: 3 },
  { name: `iPhone 12 Pro Max`, width: 428, height: 926, scale: 3 },
  { name: `iPhone 12 Pro`, width: 390, height: 844, scale: 3 },
  { name: `iPad 8th gen`, width: 810, height: 1080, scale: 2 },
  { name: `Apple Watch Series 6 Large`, width: 184, height: 224, scale: 2 },
  { name: `Apple Watch Series 6 Small`, width: 162, height: 197, scale: 2 },
  { name: `Apple Watch SE (1st) Large`, width: 184, height: 224, scale: 2 },
  { name: `Apple Watch SE (1st) Small`, width: 162, height: 197, scale: 2 },
  { name: `iPhone SE 2nd gen`, width: 375, height: 667, scale: 2 },
  { name: `iPad Pro (4th gen 12.9")`, width: 1024, height: 1366, scale: 2 },
  { name: `iPad Pro (4th gen 11")`, width: 834, height: 1194, scale: 2 },
  { name: `iPad 7th gen`, width: 810, height: 1080, scale: 2 },
  { name: `iPhone 11 Pro Max`, width: 414, height: 896, scale: 3 },
  { name: `iPhone 11 Pro`, width: 375, height: 812, scale: 3 },
  { name: `iPhone 11`, width: 414, height: 896, scale: 2 },
  { name: `Apple Watch Series 5 Large`, width: 184, height: 224, scale: 2 },
  { name: `Apple Watch Series 5 Small`, width: 162, height: 197, scale: 2 },
  { name: `iPod touch 7th gen`, width: 320, height: 568, scale: 2 },
  { name: `iPad Mini (5th gen)`, width: 768, height: 1024, scale: 2 },
  { name: `iPad Air (3rd gen)`, width: 834, height: 1112, scale: 2 },
  { name: `iPad Pro (3rd gen 12.9")`, width: 1024, height: 1366, scale: 2 },
  { name: `iPad Pro (3rd gen 11")`, width: 834, height: 1194, scale: 2 },
  { name: `iPhone XR`, width: 414, height: 896, scale: 2 },
  { name: `iPhone XS Max`, width: 414, height: 896, scale: 3 },
  { name: `iPhone XS`, width: 375, height: 812, scale: 3 },
  { name: `Apple Watch Series 4 Large`, width: 184, height: 224, scale: 2 },
  { name: `Apple Watch Series 4 Small`, width: 162, height: 197, scale: 2 },
  { name: `iPad 6th gen`, width: 768, height: 1024, scale: 2 },
  { name: `iPhone X`, width: 375, height: 812, scale: 3 },
  { name: `iPhone 8 Plus`, width: 414, height: 736, scale: 3 },
  { name: `iPhone 8`, width: 375, height: 667, scale: 2 },
  { name: `Apple Watch Series 3 Large`, width: 156, height: 195, scale: 2 },
  { name: `Apple Watch Series 3 Small`, width: 156, height: 170, scale: 2 },
  { name: `iPad Pro (2nd gen 12.9")`, width: 1024, height: 1366, scale: 2 },
  { name: `iPad Pro (2nd gen 10.5")`, width: 834, height: 1112, scale: 2 },
  { name: `iPad 5th gen`, width: 768, height: 1024, scale: 2 },
  { name: `iPhone 7 Plus`, width: 414, height: 736, scale: 3 },
  { name: `iPhone 7`, width: 375, height: 667, scale: 2 },
  { name: `Apple Watch Series 2 Large`, width: 156, height: 195, scale: 2 },
  { name: `Apple Watch Series 2 Small`, width: 156, height: 170, scale: 2 },
  { name: `Apple Watch Series 1 Large`, width: 156, height: 195, scale: 2 },
  { name: `Apple Watch Series 1 Small`, width: 156, height: 170, scale: 2 },
  { name: `iPhone SE 1st gen`, width: 320, height: 568, scale: 2 },
  { name: `iPad Pro (1st gen 9.7')`, width: 768, height: 1024, scale: 2 },
  { name: `iPad Pro (1st gen 12.9")`, width: 1024, height: 1366, scale: 2 },
  { name: `iPhone 6s Plus`, width: 414, height: 736, scale: 3 },
  { name: `iPhone 6s`, width: 375, height: 667, scale: 2 },
  { name: `iPad mini 4`, width: 768, height: 1024, scale: 2 },
  { name: `iPod touch 6th gen`, width: 320, height: 568, scale: 2 },
  { name: `Apple Watch 1st (Series 0) Large`, width: 156, height: 195, scale: 2 },
  { name: `Apple Watch 1st (Series 0) Small`, width: 156, height: 170, scale: 2 },
  { name: `iPad Air 2`, width: 768, height: 1024, scale: 2 },
  { name: `iPad mini 3`, width: 768, height: 1024, scale: 2 },
  { name: `iPhone 6 Plus`, width: 414, height: 736, scale: 3 },
  { name: `iPhone 6`, width: 375, height: 667, scale: 2 },
  { name: `iPad mini 2`, width: 768, height: 1024, scale: 2 },
  { name: `iPad Air`, width: 768, height: 1024, scale: 2 },
  { name: `iPhone 5C`, width: 320, height: 568, scale: 2 },
  { name: `iPhone 5S`, width: 320, height: 568, scale: 2 },
  { name: `iPad 4th gen`, width: 768, height: 1024, scale: 2 },
  { name: `iPad mini`, width: 768, height: 1024, scale: 1 },
  { name: `iPod touch 5th gen`, width: 320, height: 568, scale: 2 },
  { name: `iPhone 5`, width: 320, height: 568, scale: 2 },
  { name: `iPad 3rd gen`, width: 768, height: 1024, scale: 2 },
  { name: `iPhone 4S`, width: 320, height: 480, scale: 2 },
  { name: `iPad 2`, width: 768, height: 1024, scale: 1 },
  { name: `iPod touch 4th gen`, width: 320, height: 480, scale: 2 },
  { name: `iPhone 4`, width: 320, height: 480, scale: 2 },
  { name: `iPad 1st gen`, width: 768, height: 1024, scale: 1 },
  { name: `iPod touch 3rd gen`, width: 320, height: 480, scale: 1 },
  { name: `iPhone 3GS`, width: 320, height: 480, scale: 1 },
  { name: `iPod touch 2nd gen`, width: 320, height: 480, scale: 1 },
  { name: `iPhone 3G`, width: 320, height: 480, scale: 1 },
  { name: `iPod touch 1st gen`, width: 320, height: 480, scale: 1 },
  { name: `iPhone 1st gen`, width: 320, height: 480, scale: 1 }
];

// Array to store HTML code for the links to splash screen images
let htmlLinks = [];

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

  const outputFilePath = `dist/splash-screen/${fileName}.png`;

  const outputStream = fs.createWriteStream(outputFilePath);
  const pngStream = canvas.createPNGStream();
  pngStream.pipe(outputStream);

  // Wait for the image to finish writing, then add a link to the HTML links array
  await new Promise((resolve) => {
    outputStream.on('finish', () => {
      htmlLinks.push(`<link rel="apple-touch-startup-image" href="./splash-screen/${fileName}.png" media="(device-width: ${deviceInfo.width}px) and (device-height: ${deviceInfo.height}px) and (-webkit-device-pixel-ratio: ${deviceInfo.scale})">`);
      resolve();
    });
  });
}

// Function to process icon and background images for a single device
async function processImageFiles(deviceInfo) {
  const iconPath = 'icons/transparent.png';
  const bgPath = 'icons/bg.png';
  const iconImage = await loadImage(iconPath);
  const backgroundImage = await loadImage(bgPath);
  await processDeviceImage(deviceInfo, iconImage, backgroundImage);
}

// Function to process images for all devices in the deviceData array
async function processImages() {
  for (const deviceInfo of deviceData) {
    await processImageFiles(deviceInfo);
  }
}

// Function to create the output directory for the splash screen images
async function createOutputDirectories() {
  const outputDir = 'dist/splash-screen';

  try {
    await fs.promises.mkdir(outputDir, { recursive: true });
  } catch (err) {
    console.error('Error creating directories:', err);
  }
}

// Main asynchronous function to generate splash screen images and HTML file
(async () => {
  try {
    await createOutputDirectories();
    await processImages();
    fs.writeFileSync('dist/splash-screen/html.txt', htmlLinks.join('\n'));
    console.log('Images and HTML code generated successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
})();
