// Function to split data based on delta

/**
 * Splits data into groups based on delta between consecutive elements.
 *
 * @param {Array<[number, number]>} data - Array of tuples where each tuple contains two numbers.
 * @returns {Array<Array<[number, number]>>} - Array of groups, each containing arrays of tuples.
 */

export function splitDataByDelta(data: Array<[number, number]>): Array<Array<[number, number]>> {
  const result: Array<Array<[number, number]>> = [];
  let currentGroup: Array<[number, number]> = [];

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

/**
 * Get common items from the two arrays
 * @param arrayA - The first array
 * @param arrayB - The second array
 * @returns An array of the common items
 */

export function getIntersection(arrayA: Array, arrayB: Array): Array {
  let result = [];
  if (arrayA.length <= arrayB.length) {
    for (const item of arrayA) {
      if (arrayB.indexOf(item) > -1) {
        result.push(item);
      }
    }
  } else {
    for (const item of arrayB) {
      if (arrayA.indexOf(item) > -1) {
        result.push(item);
      }
    }
  }
  return result;
}
