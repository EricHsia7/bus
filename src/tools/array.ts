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

export function getUnion(arrayA: Array, arrayB: Array): Array {
  let result = [];
  if (arrayA.length >= arrayB) {
    result = arrayA;
    for (const item of arrayB) {
      if (result.indexOf(item) < 0) {
        result.push(item);
      }
    }
  } else {
    result = arrayB;
    for (const item of arrayA) {
      if (result.indexOf(item) < 0) {
        result.push(item);
      }
    }
  }
  return result;
}
