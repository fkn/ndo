import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import UnitType from '../types/UnitType';
import { Unit, User, Course } from '../models';

const createUnit = {
  type: UnitType,
  args: {
    title: {
      description: 'The title of the new unit',
      type: new NonNull(StringType),
    },
    courseId: {
      description: 'Id of the unit',
      type: new NonNull(StringType),
    },
    body: {
      description: 'body of the unit',
      type: StringType,
    },
  },
  async resolve({ request }, { title, body, courseId }) {
    try {
      if (!request.user) throw new Error('User is not logged in');
      const user = await User.findById(request.user.id);
      const role = await user.getRole(courseId);
      if (!user.isAdmin && (!role || role !== 'teacher'))
        throw new Error("User doesn't have rights to edit this course");
      const course = await Course.findById(courseId);
      return Unit.create({ title, body })
        .then(u => {
          u.setCourses([course]);
          return u;
        })
        .catch(err => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

const removeUnit = {
  type: UnitType,
  args: {
    id: {
      description: 'id of the Unit',
      type: new NonNull(StringType),
    },
  },
  resolve(parent, args) {
    return Unit.findById(args.id)
      .then(unit => unit.destroy())
      .then(() => {});
  },
};

const units = {
  type: new List(UnitType),
  args: {
    ids: {
      description: 'ids of the Unit',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    if (args.ids) {
      return Unit.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    return Unit.findAll();
  },
};

const updateUnit = {
  type: UnitType,
  args: {
    id: {
      description: 'id of the Unit',
      type: new NonNull(StringType),
    },
    title: {
      description: 'The title of the Unit',
      type: StringType,
    },
    body: {
      description: 'The body of the Unit',
      type: StringType,
    },
  },
  resolve(parent, { id, ...rest }) {
    return Unit.findById(id).then(unit => unit.update({ ...rest }));
  },
};

export { createUnit, removeUnit, units, updateUnit };
