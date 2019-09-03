const w = window;
const d = document;

export let showElement = element => (element.style.display = 'inline');
export let hideElement = element => (element.style.display = 'none');
export let $ = d.querySelector.bind(d);
export let $c = d.createElement.bind(d);
export let $rAF = requestAnimationFrame.bind(w);
export let $sT = setTimeout.bind(w);
export let $cT = clearTimeout.bind(w);
export let $sI = setInterval.bind(w);
export let $cI = clearInterval.bind(w);
export let $aEL = addEventListener.bind(w);
export let $rEL = removeEventListener.bind(w);
export let $r = Math.random.bind(Math);
export let $mx = Math.max.bind(Math);
export let $ms = Math.min.bind(Math);
export let aC = (element, ...classNames) =>
  element.classList.add(...classNames);
export let rC = (element, className) => element.classList.remove(className);
export let ltrim = s => s.replace(/^\s+/, '');

export let KEYPRESS = 'keypress';
export let KEYDOWN = 'keydown';
export let WARN = 'w';
