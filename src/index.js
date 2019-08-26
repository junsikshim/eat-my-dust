import { load, init, setImagePath } from 'kontra';

import { mountScene, registerScene } from './scene/Scene';
import TitleScene from './scene/TitleScene';
import GameScene from './scene/GameScene';

import '../css/styles.css';
import StoryPickerScene from './scene/StoryPickerScene';

document.addEventListener('DOMContentLoaded', () => {
  let { context } = init();

  setImagePath('images');

  load('master.png', 'cloud.png', 'dust.png').then(() => {
    registerScene(
      'title',
      new TitleScene({
        context
      })
    );
    registerScene('story', new StoryPickerScene());
    registerScene(
      'game',
      new GameScene({
        context
      })
    );

    mountScene('title');
  });
});
