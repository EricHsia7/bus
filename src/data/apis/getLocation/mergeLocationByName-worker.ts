import { SimplifiedLocation, MergedLocation } from './index';
import { md5 } from '../../../tools/index';
import { mergeAddressesIntoOne } from '../../../tools/address';

self.onmessage = function (event) {
  const result = mergeLocationByName_worker(event.data);
  self.postMessage(result); // Send the result back to the main thread
};

function mergeLocationByName_worker(object: SimplifiedLocation): MergedLocation {
  var result: MergedLocation = {};
  for (var key in object) {
    var hash = md5(
      String(object[key].n)
        .trim()
        .replaceAll(/[\(\（\）\)\:\：\~\～]*/gim, '')
    );
    var nameKey = `ml_${hash}`;
    if (!result.hasOwnProperty(nameKey)) {
      result[nameKey] = {
        n: object[key].n,
        lo: [object[key].lo],
        la: [object[key].la],
        r: [object[key].r],
        s: [object[key].s],
        v: [object[key].v],
        a: [mergeAddressesIntoOne(object[key].a)],
        id: [parseInt(key.split('_')[1])],
        hash: hash
      };
    } else {
      result[nameKey].id.push(parseInt(key.split('_')[1]));
      result[nameKey].r.push(object[key].r);
      result[nameKey].s.push(object[key].s);
      result[nameKey].v.push(object[key].v);
      result[nameKey].lo.push(object[key].lo);
      result[nameKey].la.push(object[key].la);
      result[nameKey].a.push(mergeAddressesIntoOne(object[key].a));
    }
  }
  return result;
}
