/* eslint-disable no-await-in-loop */
import fetch from 'node-fetch';
import { File, CjProblem } from '../../models';
import config from '../../../config';

async function getSourceFromFile(id) {
  const file = await File.findById(id);
  if (!file) return '';
  return file.text();
}

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function submission(data, method) {
  try {
    const url =
      config.codejudgeUrl +
      (method === 'GET' ? `submissions/${data.id}` : `submissions`);
    const res = await fetch(url, {
      method,
      body: method === 'GET' ? undefined : JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  } catch (e) {
    console.error(e);
    return 0;
  }
}

async function run(data, method) {
  try {
    const url =
      config.codejudgeUrl +
      (method === 'GET'
        ? `runs/${data.id}`
        : `runs?submission=${data.submission}&test=${data.test}`);
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  } catch (e) {
    console.error(e);
    return 0;
  }
}

async function awaitWrapper(fn, data) {
  let res = await fn(data, 'POST');
  while (res && ['processing', 'queue'].includes(res.status)) {
    await pause(1000);
    // TODO: fix in CJ that res always have id when available (sometime it's saved in res.data.id)
    res = await fn(res.data ? res.data : res, 'GET');
  }
  return res.data ? res.data : res;
}

export default function(val) {
  return async id => {
    if (!val) return 0;
    const problem = await CjProblem.findById(id);
    if (!problem) return 0;
    const tests = await problem.getTests();
    // TODO: sort tests by order field here
    if (!tests || !tests.length) return 0;
    const source =
      val.type === 'file' ? await getSourceFromFile(val.id) : String(val);

    const sol = await awaitWrapper(submission, { lang: 'java', source });

    if (sol.status === 'error') {
      return {
        mark: 0,
        comment: `<div>Compilatioon error:</div><pre>${sol.error}</pre>`,
      };
    }

    let mark = 0;
    let comment = '<div>Tests:</div><ol>';

    for (let i = 0; i < tests.length; i += 1) {
      const tr = await awaitWrapper(run, {
        submission: sol.id,
        test: tests[i].idCj,
      });
      if (tr && tr.status === 'ok' && tr.checkResult) {
        mark += 100 / tests.length;
        comment += '<li>ok</li>';
      } else if (tr && tr.status === 'ok') {
        comment += '<li>wrong answer</li>';
      } else if (tr && tr.status === 'error') {
        comment += `<li>Runtime error:<pre>${tr.error}</pre></li>`;
      }
    }

    comment += '</ol>';

    return { mark, comment };
  };
}
