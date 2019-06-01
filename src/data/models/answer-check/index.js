import equals from './equals';

const fns = { equals };

export default function buildCheckApi(val, key, doc, schema) {
  return Object.keys(fns).reduce((res, k) => {
    res[k] = fns[k](val, key, doc, schema);
    return res;
  }, {});
}
