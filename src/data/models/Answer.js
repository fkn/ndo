import DataType from 'sequelize';
import vm from 'vm';
import Model from '../sequelize';
import Mark from './Mark';
import * as util from './util';

const Answer = Model.define('answer', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  body: {
    type: DataType.TEXT,
  },
});

Answer.prototype.canRead = async function canRead(user) {
  if (util.haveAccess(user, this.userId)) return true;
  if (user && (await user.getRole(this.courseId)) === 'teacher') return true;
  return false;
};

Answer.prototype.canWrite = function canWrite(user) {
  return util.haveAccess(user, this.userId);
};

class AnswerChecker {
  static create(schema) {
    const checker = new AnswerChecker();
    checker.schema =
      typeof schema === 'string'
        ? (checker.schema = JSON.parse(schema))
        : schema;
    checker.names = Object.keys(checker.schema).filter(
      k => checker.schema[k].checker,
    );
    checker.fns = {};
    checker.names.forEach(k => checker.build(k));
    return checker;
  }

  /**
   * Any preprocessing related to checker function for key
   * @param {string} key fn key
   */
  build(key) {
    this.fns[key] = (val, doc, schema) => {
      let res = 0;
      try {
        const sandbox = { val, key, doc, schema };
        vm.createContext(sandbox);
        res = vm.runInContext(this.schema[key].checker, sandbox);
      } catch (e) {
        console.error(e);
      }
      return Math.min(Math.max(+res || 0, 0), 100);
    };
  }

  /**
   * Runs checker for the specified key
   * @returns {number} mark
   * @param {object} answer parsed answer object
   * @param {*} key key in answer object
   */
  run(answer, key) {
    return this.fns[key](answer[key], answer, this.schema);
  }
}

/**
 * Parses schema & answer, runs checker functions if exist and combine results
 * as an object with mark & comment
 * @returns {{mark: number, comment: string}}
 * @param {string} answerStr answer in JSON
 * @param {string|object} schema represents unit schema
 */
function autocheckAnswer(answerStr, schema) {
  if (!answerStr || !schema) return {};
  const answer = JSON.parse(answerStr);
  const checker = AnswerChecker.create(schema);
  const res = { mark: 0, comment: 'Marks:' };
  for (let i = 0; i < checker.names.length; i += 1) {
    const m = checker.run(answer, checker.names[i]);
    res.mark += (m || 0) / checker.names.length;
    res.comment += ` ${m}`;
  }
  return res;
}

async function afterUpdateAnswer(answer) {
  const unit = await answer.getUnit();
  const mark = autocheckAnswer(answer.body, unit.schema);
  // TODO: use special authorId (or the user who added answer)
  if (mark && mark.mark) {
    Mark.create({
      mark: mark.mark,
      comment: mark.comment,
      answerId: answer.id,
      // authorId: args.authorId,
    });
  }
}

Answer.hook('afterCreate', afterUpdateAnswer);
Answer.hook('afterUpdate', afterUpdateAnswer);

export default Answer;
