import { File } from '../../models';

async function getSourceFromFile(id) {
  const file = await File.findById(id);
  if (!file) return '';
  return file.text();
}

export default function(val) {
  return async id => {
    if (!val) return 0;
    const source =
      val.type === 'file' ? await getSourceFromFile(val.id) : String(val);
    // TODO: get tests for problem ID & run them here on CJ for source
    // eslint-disable-next-line no-console
    console.log(id, source);
    return 50;
  };
}
