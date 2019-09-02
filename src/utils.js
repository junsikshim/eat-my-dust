export var showElement = element => (element.style.display = 'inline');
export var hideElement = element => (element.style.display = 'none');
export var $ = document.querySelector.bind(document);
export var $c = document.createElement.bind(document);
export var $rAF = requestAnimationFrame.bind(window);
export var $sT = setTimeout.bind(window);
export var $cT = clearTimeout.bind(window);
export var $sI = setInterval.bind(window);
export var $cI = clearInterval.bind(window);
export var $aEL = addEventListener.bind(window);
export var $rEL = removeEventListener.bind(window);
export var $r = Math.random.bind(Math);
export var $mx = Math.max.bind(Math);
export var $ms = Math.min.bind(Math);
export var aC = (element, ...classNames) =>
  element.classList.add(...classNames);
export var rC = (element, className) => element.classList.remove(className);
export var ltrim = s => s.replace(/^\s+/, '');

export var KEYPRESS = 'keypress';
export var KEYDOWN = 'keydown';
export var WARN = 'w';
