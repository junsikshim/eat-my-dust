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
    const T = this;

    showElement($('#d-sp'));
    showElement($('#d-gm'));

    const container = $('#sl');
    container.innerHTML = '';

    data.forEach((d, i) => {
      const elem = createElement(d, i);
      container.appendChild(elem);
    });

    T.keyHandler = handleKeys({
      onKeyUp: () => {
        selectedStory--;

        if (selectedStory < 0) selectedStory = data.length - 1;

        T.updateStoryList();
      },
      onKeyDown: () => {
        selectedStory++;

        if (selectedStory >= data.length) selectedStory = 0;

        T.updateStoryList();
      },
      onKeyEnter: () => {
        T.selectStory();
      },
      onKeyEscape: () => {
        mountScene('title');
      }
    });

    $aEL(KEYDOWN, T.keyHandler);
  }

  updateStoryList() {
    const container = $('#sl');
    const stories = container.childNodes;

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

const createElement = (data, index) => {
  const li = $c('li');
  aC(li, 'story');
  li.innerHTML = `${index + 1}. ${data.title}`;

  if (index === 0) aC(li, 's');

  return li;
};

const handleKeys = ({ onKeyUp, onKeyDown, onKeyEnter, onKeyEscape }) => e => {
  switch (e.key) {
    case 'ArrowUp':
      onKeyUp();
      break;
    case 'ArrowDown':
      onKeyDown();
      break;
    case 'Enter':
      onKeyEnter();
      break;
    case 'Escape':
      onKeyEscape();
      break;
  }
};

export default StoryPickerScene;