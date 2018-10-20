import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import UserType from '../types/UserType';
import User from '../models/User';
import GroupType from '../types/GroupType';
import Group from '../models/Group';

const createGroup = {
  type: GroupType,
  args: {
    title: {
      description: 'The title of the new group',
      type: new NonNull(StringType),
    },
  },
  resolve(parent, args) {
    return Group.create({
      title: args.title,
    });
  },
};

const removeGroup = {
  type: GroupType,
  args: {
    id: {
      description: 'id of the group',
      type: new NonNull(StringType),
    },
  },
  resolve(parent, args) {
    return Group.findById(args.id)
      .then(group => group.destroy())
      .then(() => {});
  },
};

const updateGroup = {
  type: GroupType,
  args: {
    id: {
      description: 'id of the group',
      type: new NonNull(StringType),
    },
    title: {
      description: 'The title of the group',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return Group.findById(args.id).then(group => group.update({ ...args }));
  },
};

const groups = {
  type: new List(GroupType),
  args: {
    ids: {
      description: 'ids of the group',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    if (args.ids) {
      return Group.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    return Group.findAll();
  },
};

const addUserToGroup = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: new NonNull(StringType),
    },
    groupId: {
      description: 'id of the group',
      type: new NonNull(StringType),
    },
  },
  resolve(obj, args) {
    return User.findById(args.id).then(user =>
      user.addGroup(args.groupId).then(() => user),
    );
  },
};

const deleteUserFromGroup = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: StringType,
    },
    groupId: {
      description: 'id of the group',
      type: StringType,
    },
  },
  resolve(obj, args) {
    return User.findById(args.id).then(user =>
      user.removeGroup(args.groupId).then(() => user),
    );
  },
};

export {
  groups,
  createGroup,
  removeGroup,
  updateGroup,
  addUserToGroup,
  deleteUserFromGroup,
};
