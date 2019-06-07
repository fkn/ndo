import DataType from 'sequelize';
import vm from 'vm';
import Model from '../sequelize';
import Mark from './Mark';
import * as util from './util';
import buildCheckApi from './answer-check';

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
    checker.weights = {};
    checker.weightSum = 0;
    checker.names.forEach(k => {
      checker.build(k);
      checker.weights[k] = +checker.schema[k].weight || 1;
      checker.weightSum += checker.weights[k];
    });
    return checker;
  }

  mark(key, m) {
    return (this.weights[key] * (m || 0)) / this.weightSum;
  }

  /**
   * Any preprocessing related to checker function for key
   * @param {string} key fn key
   */
  build(key) {
    this.fns[key] = async (val, doc, schema) => {
      let res = 0;
      try {
        const sandbox = {
          val,
          key,
          doc,
          schema,
          check: buildCheckApi(val, key, doc, schema),
        };
        vm.createContext(sandbox);
        res = await vm.runInContext(this.schema[key].checker, sandbox);
      } catch (e) {
        console.error(e);
      }
      let mark = 0;
      let comment = '';
      if (typeof res === 'object') {
        mark = res.mark;
        comment = res.comment;
      } else mark = res;
      return {
        mark: Math.min(Math.max(+mark || 0, 0), 100),
        comment: String(comment),
      };
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
async function autocheckAnswer(answerStr, schema) {
  if (!answerStr || !schema) return {};
  const answer = JSON.parse(answerStr);
  const checker = AnswerChecker.create(schema);
  let mark = 0;
  let comment = '<p>Autocheck summary:</p><ul>';
  for (let i = 0; i < checker.names.length; i += 1) {
    const key = checker.names[i];
    // eslint-disable-next-line no-await-in-loop
    const res = await checker.run(answer, key);
    const m = checker.mark(key, res.mark);
    mark += m;
    const frac = `${m.toFixed(1)}/${checker.mark(key, 100).toFixed(1)}`;
    comment += `<li>${key}: ${frac}${res.comment || ''}</li>`;
  }
  comment += '</ul>';
  mark = Math.max(Math.min(mark, 100), 0);
  return { mark, comment };
}

async function afterUpdateAnswer(answer) {
  const unit = await answer.getUnit();
  const mark = await autocheckAnswer(answer.body, unit.schema);
  // TODO: use special authorId (or the user who added answer)
  if (mark && mark.comment) {
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
