import { loadImage, init, setImagePath } from './kontra/kontra';
import { mountScene, registerScene } from './scene/Scene';
import TitleScene from './scene/TitleScene';
import GameScene from './scene/GameScene';
import StoryPickerScene from './scene/StoryPickerScene';
import { $aEL } from './utils';

import '../css/styles.css';

$aEL('DOMContentLoaded', () => {
  let { context } = init();

  setImagePath('images');

  // load('m.png', 'c.png', 'd.png').then(() => {
  Promise.all([
    loadImage('m.png'),
    loadImage('c.png'),
    loadImage('d.png')
  ]).then(() => {
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
