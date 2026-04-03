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
  const result = [];
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

export type Interval = [start: number, end: number];
export type IntervalArray = Array<Interval>;

export function union(intervals: IntervalArray): IntervalArray {
  const length = intervals.length;
  if (length < 2) {
    return intervals;
  }

  intervals.sort(function (a, b) {
    return a[0] - b[0];
  });

  const result = [intervals[0]];
  let index = 0;

  for (let i = 1; i < length; i++) {
    if (intervals[i][0] >= result[index][0] && intervals[i][0] <= result[index][1]) {
      if (intervals[i][1] <= result[index][1]) {
        continue;
      } else {
        result[index][1] = intervals[i][1];
      }
    } else {
      result.push(intervals[i]);
      index++;
    }
  }
  return result;
}
