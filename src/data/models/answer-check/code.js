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

async function solution(data, method) {
  try {
    const url =
      config.codejudgeUrl +
      (method === 'GET' ? `solutions/${data.id}` : `solutions`);
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
        : `runs?solution=${data.solution}&test=${data.test}`);
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

// TODO: fix in CJ so first POST /runs returns queue (similar to POST /solutions)
async function awaitWrapper(fn, data, { firstOk = false } = {}) {
  let res = await fn(data, 'POST');
  let cnt = 0;
  while (
    res &&
    (res.status === 'queue' || (firstOk && !cnt && res.status === 'ok'))
  ) {
    await pause(5000);
    // TODO: fix in CJ that res always have id when available (sometime it's saved in res.data.id)
    res = await fn(res.data ? res.data : res, 'GET');
    cnt += 1;
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

    const sol = await awaitWrapper(solution, { lang: 'java', source });

    let res = 0;

    for (let i = 0; i < tests.length; i += 1) {
      const tr = await awaitWrapper(
        run,
        {
          solution: sol.id,
          test: tests[i].idCj,
        },
        { firstOk: true },
      );
      if (tr && tr.status === 'ok') {
        res += 100 / tests.length;
      }
    }

    return res;
  };
}
