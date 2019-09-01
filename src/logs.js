import { generateGhostData } from './data';

const LOGS_PREFIX = 'EAT_MY_DUST_';

const lS = localStorage;

export const getLogs = storyId => total => {
  const s = lS.getItem(LOGS_PREFIX + storyId);

  if (!s) return [generateGhostData(441)];

  const logs = JSON.parse(s);

  return logs.slice(0, total);
};

export const saveLog = storyId => log => {
  const s = lS.getItem(LOGS_PREFIX + storyId);

  const logs = s ? JSON.parse(s) : [];

  logs.push(log);
  logs.sort((a, b) => b.d - a.d);

  const partial = logs.slice(0, 10);
  const r = JSON.stringify(partial);

  lS.setItem(LOGS_PREFIX + storyId, r);
};
