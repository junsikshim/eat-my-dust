export const showElement = element => (element.style.display = 'inline');
export const hideElement = element => (element.style.display = 'none');
export const $ = document.querySelector.bind(document);
export const $c = document.createElement.bind(document);
export const $rAF = requestAnimationFrame.bind(window);
export const $sT = setTimeout.bind(window);
export const $cT = clearTimeout.bind(window);
export const $sI = setInterval.bind(window);
export const $cI = clearInterval.bind(window);
export const $aEL = addEventListener.bind(window);
export const $rEL = removeEventListener.bind(window);
export const $r = Math.random.bind(Math);
export const $mx = Math.max.bind(Math);
export const $ms = Math.min.bind(Math);
export const aC = (element, ...classNames) =>
  element.classList.add(...classNames);
export const rC = (element, className) => element.classList.remove(className);

export const KEYPRESS = 'keypress';
export const KEYDOWN = 'keydown';
