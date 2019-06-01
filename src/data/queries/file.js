import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import FileType from '../types/FileType';
import File from '../models/File';
import { NotLoggedInError, NoAccessError } from '../../errors';

const files = {
  type: new List(FileType),
  args: {
    ids: {
      description: 'ids of the file',
      type: new List(StringType),
    },
  },
  async resolve({ request }, args) {
    const { user } = request;
    if (!user) throw new NotLoggedInError();
    let fls;
    if (args.ids) {
      fls = await File.findAll({
        where: {
          id: args.ids,
        },
      });
    } else fls = await File.findAll({ where: { userId: user.id } });
    for (let i = 0; i < fls.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await fls[i].canRead(user))) throw new NoAccessError();
    }
    return fls;
  },
};

const uploadFile = {
  type: FileType,
  args: {
    parentType: { type: new NonNull(StringType) },
    parentId: { type: new NonNull(StringType) },
    key: { type: new NonNull(StringType) },
  },
  resolve({ request }, args) {
    if (!request.user) throw new NotLoggedInError();
    return File.uploadFile({
      internalName: request.files[0].originalname,
      userId: request.user.id,
      buffer: request.files[0].buffer,
      parentType: args.parentType,
      parentId: args.parentId,
      key: args.key,
    });
  },
};

export { files, uploadFile };
