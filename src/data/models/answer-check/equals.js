export default function(val) {
  return valExp => {
    let res;
    if (valExp instanceof RegExp) res = valExp.test(val || '');
    else if (typeof valExp === 'string')
      res = (val || '').trim() === valExp.trim();
    else if (typeof valExp === 'number') res = +val === valExp;
    else if (typeof valExp === 'boolean') res = !!val === valExp;
    return +res * 100;
  };
}
