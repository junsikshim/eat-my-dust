import { generateGhostData } from './data';

var LOGS_PREFIX = 'EAT_MY_DUST_';

var lS = localStorage;

export var getLogs = storyId => total => {
  var s = lS.getItem(LOGS_PREFIX + storyId);

  if (!s) return [generateGhostData(441)];

  var logs = JSON.parse(s);

  return logs.slice(0, total);
};

export var saveLog = storyId => log => {
  var s = lS.getItem(LOGS_PREFIX + storyId);

  var logs = s ? JSON.parse(s) : [];

  logs.push(log);
  logs.sort((a, b) => b.d - a.d);

  var partial = logs.slice(0, 10);
  var r = JSON.stringify(partial);

  lS.setItem(LOGS_PREFIX + storyId, r);
};
