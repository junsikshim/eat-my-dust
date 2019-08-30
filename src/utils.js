export const showElement = element => (element.style.display = 'inline');
export const hideElement = element => (element.style.display = 'none');
export const $ = document.querySelector.bind(document);
export const $c = document.createElement.bind(document);
