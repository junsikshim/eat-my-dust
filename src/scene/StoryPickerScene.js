import Scene, { mountScene } from './Scene';
import {
  showElement,
  hideElement,
  $,
  $c,
  $aEL,
  $rEL,
  KEYDOWN,
  aC,
  rC
} from '../utils';
import data from '../data';

let selectedStory = 0;

class StoryPickerScene extends Scene {
  constructor(options) {
    super('story', options);
  }

  mount() {
    var T = this;

    showElement($('#d-sp'));
    showElement($('#d-gm'));

    var container = $('#sl');
    container.innerHTML = '';

    data.forEach((d, i) => {
      var elem = createElement(d, i);
      container.appendChild(elem);
    });

    T.keyHandler = handleKeys({
      ArrowUp: () => {
        selectedStory--;

        if (selectedStory < 0) selectedStory = data.length - 1;

        T.updateStoryList();
      },
      ArrowDown: () => {
        selectedStory++;

        if (selectedStory >= data.length) selectedStory = 0;

        T.updateStoryList();
      },
      Enter: () => T.selectStory(),
      Escape: () => mountScene('title')
    });

    $aEL(KEYDOWN, T.keyHandler);
  }

  updateStoryList() {
    var container = $('#sl');
    var stories = container.childNodes;

    stories.forEach((s, i) => {
      i === selectedStory ? aC(s, 's') : rC(s, 's');
    });
  }

  selectStory() {
    mountScene('game', {
      story: data[selectedStory]
    });
  }

  unmount() {
    hideElement($('#d-sp'));
    hideElement($('#d-gm'));

    $rEL(KEYDOWN, this.keyHandler);
  }
}

var createElement = (data, index) => {
  var li = $c('li');
  aC(li, 'story');
  li.innerHTML = `${index + 1}. ${data.title}`;

  if (index === 0) aC(li, 's');

  return li;
};

var handleKeys = handler => e => handler[e.key]();

export default StoryPickerScene;
