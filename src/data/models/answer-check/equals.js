export default function(val) {
  return exps => {
    if (!Array.isArray(exps)) exps = [exps];
    return (
      +exps.some(valExp => {
        if (valExp instanceof RegExp) return valExp.test(val || '');
        if (typeof valExp === 'string')
          return (val || '').trim() === valExp.trim();
        if (typeof valExp === 'number') return +val === valExp;
        if (typeof valExp === 'boolean') return !!val === valExp;
        return false;
      }) * 100
    );
  };
}
