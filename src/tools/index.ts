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

export function mergeAddressesIntoString(addresses: string[]): string {
  const parts = [
    {
      suffixes: '市',
      key: 'city',
      process: function (e) {
        if (e === null) {
          return null;
        } else {
          return e.map((t) => {
            return t.trim();
          });
        }
      },
      type: 0
    },
    {
      suffixes: '區',
      key: 'district',
      process: function (e) {
        if (e === null) {
          return null;
        } else {
          return e.map((t) => {
            return t.trim();
          });
        }
      },
      type: 0
    },
    {
      suffixes: '鄉鎮村里',
      key: 'area',
      process: function (e) {
        if (e === null) {
          return null;
        } else {
          return e.map((t) => {
            return t.trim();
          });
        }
      },
      type: 0
    },
    {
      suffixes: '路街道',
      key: 'road',
      process: function (e) {
        if (e === null) {
          return null;
        } else {
          return e.map((t) => {
            return t.trim();
          });
        }
      },
      type: 0
    },
    {
      suffixes: '段',
      key: 'road_section',
      process: function (e) {
        var toNumber = function (char) {
          switch (char) {
            case '一':
              return 1;
              break;
            case '二':
              return 2;
              break;
            case '三':
              return 3;
              break;
            case '四':
              return 4;
              break;
            case '五':
              return 5;
              break;
            case '六':
              return 6;
              break;
            case '七':
              return 7;
              break;
            case '八':
              return 8;
              break;
            case '九':
              return 9;
              break;
            case '十':
              return 10;
              break;
          }
          if (!isNaN(parseInt(char))) {
            return parseInt(char);
          }
          return 0;
        };
        var len = String(e).length;
        var numbers = [];
        for (var i = 0; i < len; i++) {
          var p = toNumber(String(e).charAt(i));
          if (p === 10) {
            if (numbers.length > 0) {
              numbers = [numbers.reduce((a, b) => a + b, 0) * 10];
            }
          } else {
            numbers = [numbers.reduce((a, b) => a + b, 0) + p];
          }
        }
        return numbers;
      },
      type: 0
    },
    {
      suffixes: '巷',
      key: 'alley',
      process: function (e) {
        if (e === null) {
          return null;
        } else {
          return e.map((t) => {
            return parseInt(t.trim().replaceAll(/[巷]/gim));
          });
        }
      },
      type: 0
    },
    {
      suffixes: '弄',
      key: 'alley_branch',
      process: function (e) {
        if (e === null) {
          return null;
        } else {
          return e.map((t) => {
            return parseInt(t.trim().replaceAll(/[弄]/gim));
          });
        }
      },
      type: 0
    },
    {
      suffixes: '號',
      key: 'doorplate',
      process: function (e) {
        var numbers = String(e).match(/[0-9]+/gim);
        numbers =
          numbers?.map((n) => {
            if (n === null) {
              return null;
            } else {
              return parseInt(n);
            }
          }) || null;
        return numbers;
      },
      type: 0
    },
    {
      suffixes: '樓',
      key: 'floornumber',
      process: function (e) {
        if (e === null) {
          return null;
        } else {
          return e.map((t) => {
            return t.trim();
          });
        }
      },
      type: 0
    },
    {
      key: 'exit',
      process: function (e) {
        if (e === null) {
          return null;
        } else {
          return e.map((t) => {
            return t.trim();
          });
        }
      },
      type: 2
    },
    {
      key: 'direction',
      process: function (e) {
        if (e === null) {
          return null;
        } else {
          return e.map((t) => {
            return t.trim().replace(/[往向]/gim, '');
          });
        }
      },
      type: 1
    }
  ];

  function parseAddress(address: string): object {
    function regex(suffixes, type) {
      if (type === 0) {
        return new RegExp(`([^市區鄉鎮村里路段街道巷弄號樓與]+[${suffixes}])`, 'gmi');
      }
      if (type === 1) {
        return new RegExp(`([往向]+[東南西北])`, 'gmi');
      }
      if (type === 2) {
        return new RegExp(`([0-9]+[號]出口)`, 'gmi');
      }
    }
    var result = {};
    for (var part of parts) {
      var r = regex(part === null || part === void 0 ? void 0 : part.suffixes, part.type);
      result[part.key] = part.process(String(address).match(r));
    }
    return result;
  }

  function mergeAddresses(addresses: string[]): object {
    var result = {};
    for (var address of addresses) {
      var parsedAddress = parseAddress(address);
      for (var part of parts) {
        if (!result.hasOwnProperty(part.key)) {
          result[part.key] = [];
        }
        result[part.key] = result[part.key].concat(parsedAddress[part.key]);
      }
    }
    for (var key in result) {
      result[key] = Array.from(new Set(result[key])).filter((e) => (e ? true : false));
    }
    return result;
  }

  function addressToString(address: object): string {
    return `${address.city.join('')}${address.district.join('')}${address.road.join('、')}${
      address.road_section.sort(function (a, b) {
        return a - b;
      }).length > 0
        ? address.road_section.join('、') + '段'
        : ''
    }${
      address.alley.length > 0
        ? address.alley
            .sort(function (a, b) {
              return a - b;
            })
            .join('、') + '巷'
        : ''
    }${
      address.alley_branch.length > 0
        ? address.alley_branch
            .sort(function (a, b) {
              return a - b;
            })
            .join('、') + '弄'
        : ''
    }${
      address.doorplate.length > 0
        ? address.doorplate
            .sort(function (a, b) {
              return a - b;
            })
            .join('、') + '號'
        : ''
    }${address.floornumber.length > 0 ? address.floornumber.join('、') + '樓' : ''}${address.direction.length > 0 ? '（朝' + address.direction.join('、') + '）' : ''}`;
  }

  return addressToString(mergeAddresses(addresses));
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
