const LOGS_KEY = 'type-run-logs';

export const getLogs = total => {
  const s = localStorage.getItem(LOGS_KEY);

  if (!s) return [];

  const logs = JSON.parse(s);

  return logs.slice(0, total);
};

export const saveLog = log => {
  const s = localStorage.getItem(LOGS_KEY);

  const logs = s ? JSON.parse(s) : [];

  logs.push(log);
  logs.sort((a, b) => b.d - a.d);

  const partial = logs.slice(0, 10);
  const r = JSON.stringify(partial);

  localStorage.setItem(LOGS_KEY, r);
};
