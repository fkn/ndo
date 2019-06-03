import equals from './equals';
import code from './code';

const fns = { equals, code };

export default function buildCheckApi(val, key, doc, schema) {
  return Object.keys(fns).reduce((res, k) => {
    res[k] = fns[k](val, key, doc, schema);
    return res;
  }, {});
}
