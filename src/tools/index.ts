export const md5 = require('md5');

export function getTextWidth(text, font) {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  context.fontVariationSettings = '"wght" 100';
  const metrics = context.measureText(text);
  return metrics.width;
}

export function compareThings(a: any, b: any): boolean {
  function anyToString(any: any): string {
    return JSON.stringify({ e: any });
  }
  var ax = anyToString(a);
  var bx = anyToString(b);
  const length = 32;
  if (ax.length > length || bx.length > length) {
    var hash_a = md5(ax);
    var hash_b = md5(bx);

    for (var i = 0; i < 8; i++) {
      var a_i = hash_a.charAt(i);
      var b_i = hash_b.charAt(i);
      var equal = true;
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
}

export function calculateStandardDeviation(arr: [number]) {
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

export function standardizeArray(array: [number]) {
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
export function splitDataByDelta(data: []): [] {
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

export function extractCommonFeaturesFromAddresses(addresses: string[]): string {
  // Create an object to store feature occurrences
  const featureCounts: { [key: string]: { count: number; chars: string; index: number } } = {};

  // Create a set to store unique simplified addresses
  const simplifiedSet = new Set<string>();

  // Iterate through each address
  for (const address of addresses) {
    // Extract common features by splitting the address
    const features = String(address)
      .split('')
      .filter((feature) => feature.trim() !== '');

    // Join the extracted features to create a simplified address
    const simplifiedAddress = features.join('');

    // Add the simplified address to the set
    simplifiedSet.add(simplifiedAddress);

    // Count occurrences of each feature
    let index = 0;
    for (const feature of features) {
      // Check if the feature is a digit
      if (!isNaN(parseInt(feature))) {
        // Create a key for the digit feature
        const digitKey = `digit_${index}_${feature.charCodeAt(0)}`;
        featureCounts[digitKey] = {
          count: (featureCounts[digitKey]?.count || 0) + 1,
          chars: feature,
          index: index
        };
      } else {
        // Create a key for non-digit features
        const featureKey = `chars_${index}_${feature.charCodeAt(0)}`;
        featureCounts[featureKey] = {
          count: (featureCounts[featureKey]?.count || 0) + 1,
          chars: feature,
          index: index
        };
      }
      index += 1;
    }
  }

  // Set threshold and limit for filtering features
  const threshold = addresses.length * 0.6;
  const limit = addresses.length * 1;

  // Convert the feature counts object to an array of [feature, count] pairs
  const sortedFeatures = Object.entries(featureCounts)
    .filter((pair) => threshold <= pair[1].count && pair[1].count <= limit)
    .sort((a, b) => a[1].index - b[1].index);

  // Extract the features from the sorted array
  const commonFeatures = sortedFeatures.map((pair) => pair[1].chars);

  return commonFeatures.join('');
}
