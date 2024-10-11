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

export function convertToUnitVector(vector: Array<number>): Array<number> {
  let length = Math.hypot(vector);
  let newVector = [];
  if (length > 0) {
    let scale = 1 / length;
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
  let result = [];
  for (let i = 1; i < arrayLength; i += 3) {
    const currentItem = array[i];
    const previousItem = array[i - 1] || currentItem;
    const nextItem = array[i + 1] || currentItem;
    result.push((previousItem + currentItem + nextItem) / 3);
  }
  return result;
}

export function softmaxArray(array: Array<number>): Array<number> {
  // Step 1: Exponentiate each element (for numerical stability, subtract the max value)
  const max = Math.max(...array);
  const expArr = array.map((value) => Math.exp(value - max));

  // Step 2: Sum all the exponentiated values
  const sumExp = expArr.reduce((accumulation, value) => accumulation + value, 0);

  // Step 3: Normalize each value
  return expArr.map((value) => value / sumExp);
}

export function calculateAverage(array: Array<number>): number {
  if (array.length === 0) {
    return 0;
  } else {
    const sum = array.reduce((acc, curr) => acc + curr, 0);
    return sum / array.length;
  }
}

export function aggregateNumbers(array: Array<number>): Array<number> {
  let roundedArray = [];
  for (const item of array) {
    let roundedItem = Math.trunc(item);
    if (!roundedArray.includes(roundedItem)) {
      roundedArray.push(roundedItem);
    }
  }

  let groupedNumbers = {};
  const base = Math.log(1.2);
  for (const item2 of roundedArray) {
    let groupKey = `k_${Math.round(Math.log(Math.max(item2, 1)) / base)}`;
    if (!groupedNumbers.hasOwnProperty(groupKey)) {
      groupedNumbers[groupKey] = [];
    }
    groupedNumbers[groupKey].push(item2);
  }

  let result = [];
  for (const key in groupedNumbers) {
    let group = groupedNumbers[key];
    const groupLength = group.length;
    let average = 0;
    if (groupLength > 0) {
      average = group.reduce((a, b) => a + b, 0) / groupLength;
    }
    result.push(Math.trunc(average));
  }

  result.sort((a, b) => a - b);
  return result;
}
