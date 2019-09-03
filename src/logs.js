import { generateGhostData } from './data';

let LOGS_PREFIX = 'EAT_MY_DUST_';

let lS = localStorage;

// get logs from localStorage
export let getLogs = storyId => total => {
  let s = lS.getItem(LOGS_PREFIX + storyId);

  if (!s) return [generateGhostData(441)];

  let logs = JSON.parse(s);

  return logs.slice(0, total);
};

// save logs to localStorage
export let saveLog = storyId => log => {
  let s = lS.getItem(LOGS_PREFIX + storyId);

  let logs = s ? JSON.parse(s) : [];

  logs.push(log);
  logs.sort((a, b) => b.d - a.d);

  let partial = logs.slice(0, 10);
  let r = JSON.stringify(partial);

  lS.setItem(LOGS_PREFIX + storyId, r);
};
