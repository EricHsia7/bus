export function calculateStandardDeviation(arr: Array<number>): number {
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

export function standardizeArray(array: Array<number>): Array<number> {
  // Calculate the mean of the array
  const mean = array.reduce((acc, val) => acc + val, 0) / array.length;

  // Calculate the standard deviation
  const stdDev = calculateStandardDeviation(array);

  // Standardize the array
  return array.map((val) => (val - mean) / stdDev);
}

// Function to calculate Pearson correlation coefficient
export function pearsonCorrelation(x: Array<number>, y: Array<number>): number {
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

export function mergeStandardDeviation(targetAverage: number, targetSTDEV: number, targetDataLength: number, sourceAverage: number, sourceSTDEV: number, sourceDataLength: number): number {
  const mergedDataLength = targetDataLength + sourceDataLength;

  const mergedAverage = (targetDataLength * targetAverage + sourceDataLength * sourceAverage) / mergedDataLength;

  const mergedVariance = (targetDataLength * (Math.pow(targetSTDEV, 2) + Math.pow(targetAverage, 2)) + sourceDataLength * (Math.pow(sourceSTDEV, 2) + Math.pow(sourceAverage, 2))) / mergedDataLength - Math.pow(mergedAverage, 2);

  const mergedSTDEV = Math.sqrt(mergedVariance);
  return mergedSTDEV;
}

export function mergePearsonCorrelation(targetXAverage: number, targetYAverage: number, targetXSTDEV: number, targetYSTDEV: number, targetDataLength: number, targetCorrelation: number, sourceXAverage: number, sourceYAverage: number, sourceXSTDEV: number, sourceYSTDEV: number, sourceDataLength: number, sourceCorrelation: number): number {
  const mergedDataLength = targetDataLength + sourceDataLength;

  const mergedXAverage = (targetDataLength * targetXAverage + sourceDataLength * sourceXAverage) / mergedDataLength;
  const mergedYAverage = (targetDataLength * targetYAverage + sourceDataLength * sourceYAverage) / mergedDataLength;

  const mergedXSTDEV = mergeStandardDeviation(targetXAverage, targetXSTDEV, targetDataLength, sourceXAverage, sourceXSTDEV, sourceDataLength);
  const mergedYSTDEV = mergeStandardDeviation(targetYAverage, targetYSTDEV, targetDataLength, sourceYAverage, sourceYSTDEV, sourceDataLength);

  const mergedCorrelation = (targetDataLength * (targetXSTDEV * targetYSTDEV * targetCorrelation + targetXAverage * targetYAverage) + sourceDataLength * (sourceXSTDEV * sourceYSTDEV * sourceCorrelation + sourceXAverage * sourceYAverage) - mergedDataLength * mergedXAverage * mergedYAverage) / (mergedDataLength * mergedXSTDEV * mergedYSTDEV);
  return mergedCorrelation;
}

/**
 * get the unit vecotr towards the same direction
 * @param vector [a1, a2, a3, ...]
 * @returns [b1, b2, b3, ...]
 */

export function normalizeVector(vector: Array<number>): Array<number> {
  const length = Math.hypot(vector);
  const newVector = [];
  if (length > 0) {
    const scale = 1 / length;
    for (const x of vector) {
      newVector.push(x * scale);
    }
    return newVector;
  } else {
    return vector;
  }
}

export function smoothArray(array: Array<number>): Array<number> {
  const arrayLength = array.length;
  const result = [];
  for (let i = 1; i < arrayLength; i += 3) {
    const currentItem = array[i];
    const previousItem = array[i - 1] || currentItem;
    const nextItem = array[i + 1] || currentItem;
    result.push((previousItem + currentItem + nextItem) / 3);
  }
  return result;
}

export function softmaxArray(array: Array<number>): Array<number> {
  const arrayLength = array.length;

  // Return an empty array if the input is empty
  if (arrayLength === 0) {
    return [];
  }

  // Find the global maximum
  let max = -Infinity;
  for (let i = arrayLength - 1; i >= 0; i--) {
    const item = array[i];
    if (item > max) {
      max = item;
    }
  }

  // Exponentiate each element (for numerical stability, subtract the max value)
  // Sum all the exponentiated values
  const expArray = new Float32Array(arrayLength);
  let sumExp = 0;
  for (let j = arrayLength - 1; j >= 0; j--) {
    const exp = Math.exp(array[j] - max);
    expArray[j] = exp;
    sumExp += exp;
  }

  // Normalize each value
  const normalizedArray = new Float32Array(arrayLength);
  for (let k = arrayLength - 1; k >= 0; k--) {
    const normalizedValue = expArray[k] / sumExp;
    normalizedArray[k] = normalizedValue;
  }
  return Array.from(normalizedArray);
}

export function sigmoidArray(array: Array<number>): Array<number> {
  const arrayLength = array.length;
  const normalizedArray = new Float32Array(arrayLength);
  for (let i = arrayLength - 1; i >= 0; i--) {
    normalizedArray[i] = 1 / (1 + Math.exp(-1 * array[i]));
  }
  return Array.from(normalizedArray);
}

export function calculateAverage(array: Array<number>): number {
  if (array.length === 0) {
    return 0;
  } else {
    const sum = array.reduce((acc, curr) => acc + curr, 0);
    return sum / array.length;
  }
}

export function findExtremum(array: Array<number>): [number, number] {
  const arrayLength = array.length;
  if (arrayLength === 0) {
    return [0, 0];
  }

  let min = Infinity;
  let max = -Infinity;

  for (let i = arrayLength - 1; i >= 0; i--) {
    const item = array[i];
    if (item > max) {
      max = item;
    }
    if (item < min) {
      min = item;
    }
  }
  return [min, max];
}
