export let showElement = element => (element.style.display = 'inline');
export let hideElement = element => (element.style.display = 'none');
export let $ = document.querySelector.bind(document);
export let $c = document.createElement.bind(document);
export let $rAF = requestAnimationFrame.bind(window);
export let $sT = setTimeout.bind(window);
export let $cT = clearTimeout.bind(window);
export let $sI = setInterval.bind(window);
export let $cI = clearInterval.bind(window);
export let $aEL = addEventListener.bind(window);
export let $rEL = removeEventListener.bind(window);
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
