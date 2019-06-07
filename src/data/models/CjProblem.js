import DataType from 'sequelize';
import Model from '../sequelize';
import * as util from './util';

const CjProblem = Model.define('cjproblem', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },
  title: {
    type: DataType.STRING(255),
    allowNull: false,
  },
});

CjProblem.prototype.canRead = function canRead(user) {
  return util.haveRootAccess(user);
};

CjProblem.prototype.canWrite = function canWrite(user) {
  return util.haveRootAccess(user);
};

export default CjProblem;
