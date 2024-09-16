export const md5 = require('md5');

// var cachedTextWidth: object = {};

export function getTextWidth(text: string, weight: number, size: string, fontFamily: string, wdth: number = 100, style: string = 'normal', variant: string = 'none', lineHeight: string = '1.2'): number {
  const canvas: HTMLCanvasElement = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  const font: string = `${weight} ${size} ${fontFamily}`;
  // canvas.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${wdth}, 'ital' ${style === 'normal' ? 0 : 1}`;
  context.font = font;
  /*
  var configKey: string = `c_${md5(font)}`;
  var totalWidth: number = 0;
  var textLength: number = text.length;
  if (!cachedTextWidth.hasOwnProperty(configKey)) {
    cachedTextWidth[configKey] = {};
  }
  for (var i = 0; i < textLength; i++) {
    var char: string = text.substring(i, i + 1);
    var unicode_key: string = `u_${char.charCodeAt(0)}`;
    var charWidth: number = 0;
    if (!cachedTextWidth[configKey].hasOwnProperty(unicode_key)) {
      charWidth = context.measureText(char).width;
      cachedTextWidth[configKey][unicode_key] = charWidth;
    } else {
      charWidth = cachedTextWidth[configKey][unicode_key];
    }
    totalWidth += charWidth;
  }
  */
  return context.measureText(text).width;
}

interface BorderRadius {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

export function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number | BorderRadius, fill: string): void {
  // If radius is a single value, treat it as the same for all corners
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    // Set defaults if individual radii are not provided
    radius = {
      tl: radius.tl || 0,
      tr: radius.tr || 0,
      br: radius.br || 0,
      bl: radius.bl || 0
    };
  }

  // Start path
  ctx.beginPath();
  // Move to the top-left corner, accounting for the top-left radius
  ctx.moveTo(x + radius.tl, y);
  // Draw the top line, rounding the top-right corner
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  // Draw the right side, rounding the bottom-right corner
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  // Draw the bottom side, rounding the bottom-left corner
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  // Draw the left side, rounding the top-left corner
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  // Complete the path
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.fill(); // To fill the shape
}

export function compareThings(a: any, b: any): boolean {
  function anyToString(any: any): string {
    return JSON.stringify({ e: any });
  }
  var ax = anyToString(a);
  var bx = anyToString(b);
  const length: number = 32;
  const axLength: number = ax.length;
  const bxLength: number = bx.length;
  if (axLength === bxLength) {
    if (axLength > length || bxLength > length) {
      var hash_a: string = md5(ax);
      var hash_b: string = md5(bx);

      for (var i = 0; i < 8; i++) {
        var a_i: string = hash_a.charAt(i);
        var b_i: string = hash_b.charAt(i);
        var equal: boolean = true;
        if (a_i === b_i) {
          continue;
        } else {
          equal = false;
          break;
        }
      }
      return equal;
    } else {
      if (ax === bx) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

export function calculateStandardDeviation(arr: Array<number>) {
  // Step 1: Calculate the mean
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  // Step 2: Calculate the squared difference between each element and the mean
  const squaredDifferences = arr.map((val) => Math.pow(val - mean, 2));
  // Step 3: Find the mean of those squared differences
  const meanOfSquaredDifferences = squaredDifferences.reduce((acc, val) => acc + val, 0) / arr.length;
  // Step 4: Take the square root of that mean
  const standardDeviation = Math.sqrt(meanOfSquaredDifferences);
  return standardDeviation;
}

export function standardizeArray(array: Array<number>) {
  // Calculate the mean of the array
  const mean = array.reduce((acc, val) => acc + val, 0) / array.length;

  // Calculate the standard deviation
  const stdDev = calculateStandardDeviation(array);

  // Standardize the array
  return array.map((val) => (val - mean) / stdDev);
}

export function convertBytes(contentLength: number): string {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;

  while (contentLength >= 1024 && i < units.length - 1) {
    contentLength /= 1024;
    i++;
  }

  return contentLength.toFixed(2) + ' ' + units[i];
}

// Function to split data based on delta
export function splitDataByDelta(data: Array): Array {
  const result = [];
  let currentGroup = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0 || data[i][0] - data[i - 1][0] > 0) {
      if (currentGroup.length > 0) {
        result.push(currentGroup);
      }
      currentGroup = [data[i]];
    } else {
      currentGroup.push(data[i]);
    }
  }
  if (currentGroup.length > 0) {
    result.push(currentGroup);
  }
  return result;
}

// Function to calculate Pearson correlation coefficient
export function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n !== y.length) {
    throw new Error('Arrays must have the same length');
  }

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXSquared = 0,
    sumYSquared = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXSquared += x[i] ** 2;
    sumYSquared += y[i] ** 2;
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXSquared - sumX ** 2) * (n * sumYSquared - sumY ** 2));

  if (denominator === 0) {
    return 0; // Correlation is undefined in this case
  }

  return numerator / denominator;
}

export function areItemsDifferent(arr: Array): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        return false; // Found a duplicate
      }
    }
  }
  return true; // No duplicates found
}

function numberToLetters(number: number): string {
  let result = '';
  while (number > 0) {
    let remainder = (number - 1) % 26; // Adjust for 1-based indexing
    let letter = String.fromCharCode(remainder + 65); // A=65 in ASCII
    result = letter + result;
    number = Math.floor((number - 1) / 26); // Update number for next iteration
  }
  return result;
}

export function generateLetterLabels(quantity: number): Array<string> {
  var result = [];
  for (var i = 0; i < quantity; i++) {
    result.push(`地點${numberToLetters(i + 1)}`);
  }
  return result;
}

export function generateDirectionLabels(setsOfVectors: Array<Array<[number, number]>>): Array<string> {
  let result = [];
  const unknownVector = [0, 0];
  // cardinal directions
  const NorthVector = [0, 1];
  const EastVector = [1, 0];
  const WestVector = [-1, 0];
  const SouthVector = [0, -1];
  // intercardinal directions
  const NorthEastVector = [Math.sqrt(2) / 2, Math.sqrt(2) / 2]; // 45 degrees
  const SouthEastVector = [Math.sqrt(2) / 2, -Math.sqrt(2) / 2]; // 135 degrees
  const SouthWestVector = [-Math.sqrt(2) / 2, -Math.sqrt(2) / 2]; // 225 degrees
  const NorthWestVector = [-Math.sqrt(2) / 2, Math.sqrt(2) / 2]; // 315 degrees

  const directions = [
    {
      vector: unknownVector,
      label: '未知'
    },
    {
      vector: NorthVector,
      label: '北'
    },
    {
      vector: EastVector,
      label: '東'
    },
    {
      vector: SouthVector,
      label: '南'
    },
    {
      vector: WestVector,
      label: '西'
    },
    {
      vector: NorthEastVector,
      label: '東北'
    },
    {
      vector: SouthEastVector,
      label: '東南'
    },
    {
      vector: SouthWestVector,
      label: '西南'
    },
    {
      vector: NorthWestVector,
      label: '西北'
    }
  ];

  for (const vectorSet of setsOfVectors) {
    let x = 0;
    let y = 0;
    for (const vector of vectorSet) {
      x += vector[0];
      y += vector[1];
    }
    const meanVector = convertToUnitVector([x, y]);
    let result2 = [];
    for (const direction of directions) {
      const dotProduct = direction.vector[0] * meanVector[0] + direction.vector[1] * meanVector[1];
      result2.push({ label: direction.label, dotProduct: dotProduct });
    }
    result2 = result2.sort(function (a, b) {
      return b.dotProduct - a.dotProduct;
    });
    const bestMatch = result2[0];
    result.push(bestMatch.label);
  }
  return result;
}

const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function generateIdentifier(prefix: string = ''): string {
  let result = `${prefix}_`;
  const length: number = 16;
  for (var i = 0; i < length; i++) {
    var randomNumber = Math.round(Math.random() * characterSet.length);
    result += characterSet.substring(randomNumber, randomNumber + 1);
  }
  return result;
}

export function getNoCacheParameter(interval: number): string {
  var t = new Date().getTime();
  var g = (t / interval).toFixed(0) * interval;
  var str = g.toString(36);
  return str;
}

export function containPhoneticSymbols(string: string): boolean {
  var regex = /[\u3100-\u312F\ˇ\ˋ\ˊ\˙]/gm;
  if (regex.test(string)) {
    return true;
  } else {
    return false;
  }
}

export function releaseFile(content: string, type: string = 'application/json', fileName: string): void {
  const blob = new Blob([content], { type: type });
  const fileObj = new File([blob], fileName, { type: type });
  if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
    navigator
      .share({
        files: [fileObj]
      })
      .catch((error) => {});
  } else {
    const blobURL = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobURL;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
    }, 10 * 1000);
  }
}

export function isRunningStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

export function convertToUnitVector(vector: Array<number>): Array<number> {
  let sum = 0;
  for (var x of vector) {
    sum += Math.pow(x, 2);
  }
  let length = Math.sqrt(sum);
  let newVector = [];
  if (length > 0) {
    let scale = 1 / length;
    for (var x of vector) {
      newVector.push(x * scale);
    }
    return newVector;
  } else {
    return vector;
  }
}

export function supportTouch(): boolean {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    // Touch events are supported
    return true;
  } else {
    // Touch events are not supported
    return false;
  }
}