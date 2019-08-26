import Scene from './Scene';
import { showElement, hideElement, $ } from '../utils';

class StoryPickerScene extends Scene {
  constructor(options) {
    super('story', options);
  }

  mount() {
    showElement($('#div-story-picker'));
  }

  unmount() {
    hideElement($('#div-story-picker'));
  }
}

export default StoryPickerScene;
