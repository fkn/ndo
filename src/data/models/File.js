import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import fileUrl from 'file-url';
import DataType from 'sequelize';
import { promisify } from 'util';
import Model from '../sequelize';
import * as util from './util';

const File = Model.define('file', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },
  internalName: {
    type: DataType.STRING,
    allowNull: false,
  },
  url: {
    type: DataType.STRING,
  },
});

File.prototype.canRead = async function canRead(user) {
  if (util.haveAccess(user, this.userId)) return true;
  const parents = await this.getParents();
  for (let i = 0; i < parents.length; i += 1) {
    const parent = parents[i];
    // eslint-disable-next-line no-await-in-loop
    const obj = await parent.getEntity();
    // eslint-disable-next-line no-await-in-loop
    if (await obj.canRead(user)) return true;
  }
  return false;
};

File.prototype.canWrite = function canWrite(user) {
  return util.haveAccess(user, this.userId);
};

File.prototype.text = async function text() {
  const url = new URL(this.url);
  const data = await promisify(fs.readFile)(url);
  return String(data);
};

const FILES_DIR = path.join(__dirname, './files');

function uploadFileToFS(file, buffer) {
  const d = new Date();
  const dir = path.join(
    process.env.FILES_DIR || FILES_DIR,
    `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? '0' : ''}${d.getMonth() + 1}`,
  );
  mkdirp.sync(`${dir}`);
  const filePath = path.join(
    dir,
    `${file.id}${path.parse(file.internalName).ext}`,
  );
  fs.writeFileSync(filePath, buffer);
  return fileUrl(filePath);
}

const memStore = {};
function uploadFileToMem(file, buffer) {
  memStore[file.id] = buffer;
  return `mem+${file.id}`;
}

export function getFileFromMem(url) {
  if (!url.startsWith('mem+')) return false;
  return memStore[url.substr(4)];
}

const storeToFn = {
  fs: uploadFileToFS,
  mem: uploadFileToMem,
};

File.uploadFile = async (
  { buffer, internalName, userId, parentType, parentId, key },
  { store = 'fs' } = {},
) => {
  try {
    const file = await File.create({
      internalName,
      userId,
    });
    if (!storeToFn[store])
      throw new Error(`store '${store}' is not implemented yet`);
    if (parentType) {
      const parent = await file.createParent({ parentType, parentId, key });
      await file.addParent(parent);
    }
    file.url = await storeToFn[store](file, buffer);
    file.save();
    return file;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default File;
