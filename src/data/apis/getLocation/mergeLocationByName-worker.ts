import { mergeAddressesIntoOne } from '../../../tools/address';
import { md5 } from '../../../tools/index';
import { MergedLocation, SimplifiedLocation } from './index';

self.onmessage = function (e) {
  const result = processWorkerTask(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function processWorkerTask(object: SimplifiedLocation): MergedLocation {
  const result: MergedLocation = {};
  for (const key in object) {
    const hash = md5(
      String(object[key].n)
        .trim()
        .replaceAll(/[\(\（\）\)\:\：\~\～]*/gim, '')
    );
    const nameKey = `ml_${hash}`;
    if (!result.hasOwnProperty(nameKey)) {
      result[nameKey] = {
        n: object[key].n,
        lo: [object[key].lo],
        la: [object[key].la],
        g: [object[key].g],
        r: [object[key].r],
        s: [object[key].s],
        v: [object[key].v],
        a: [mergeAddressesIntoOne(object[key].a)],
        id: [object[key].id],
        hash: hash
      };
    } else {
      result[nameKey].lo.push(object[key].lo);
      result[nameKey].la.push(object[key].la);
      if (result[nameKey].g.indexOf(object[key].g) < 0) {
        result[nameKey].g.push(object[key].g);
      }
      result[nameKey].r.push(object[key].r);
      result[nameKey].s.push(object[key].s);
      result[nameKey].v.push(object[key].v);
      result[nameKey].a.push(mergeAddressesIntoOne(object[key].a));
      result[nameKey].id.push(object[key].id);
    }
  }
  return result;
}
