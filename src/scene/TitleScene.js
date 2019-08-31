import { GameLoop, imageAssets, Sprite, SpriteSheet, Pool } from 'kontra';

import Scene, { mountScene } from './Scene';
import { $, showElement, hideElement, $aEL, $rEL, $sI, $cI } from '../utils';
import {
  clearClouds,
  initClouds,
  renderClouds,
  startClouds,
  updateClouds
} from '../cloud';
import { createDust, initDusts, renderDusts, updateDusts } from '../dust';

const CHARACTER_OFFSET_X = 300;
const CHARACTER_WIDTH = 100;
const CHARACTER_HEIGHT = 100;

class TitleScene extends Scene {
  constructor(options) {
    super('title', options);
  }

  mount() {
    const T = this;

    showElement($('#d-tt'));
    showElement($('#d-m'));
    showElement($('#d-c'));

    const masterSheet = SpriteSheet({
      image: imageAssets['m'],
      frameWidth: 64,
      frameHeight: 64,
      animations: {
        run: {
          frames: '0..9',
          frameRate: 20
        }
      }
    });

    const master = Sprite({
      x: CHARACTER_OFFSET_X,
      y: 270 - CHARACTER_HEIGHT,
      width: CHARACTER_WIDTH,
      height: CHARACTER_HEIGHT,
      animations: masterSheet.animations
    });

    master.playAnimation('run');

    initDusts(T);

    $aEL('keypress', onKeypress);

    const createDustAt = createDust(T);

    this.dustTimer = $sI(() => {
      createDustAt(master.x, master.y);
    }, 50);

    initClouds(T);
    startClouds(T);

    const ground = $('#g');
    let groundX = 0;

    T.loop = GameLoop({
      update: function() {
        master.update();

        updateDusts(T);
        updateClouds(T, 1);

        groundX -= 4;
        updateGround(ground, groundX);
      },
      render: function() {
        master.render();

        renderDusts(T);
        renderClouds(T);
      }
    });

    T.loop.start();
  }

  unmount() {
    const T = this;

    if (T.loop) {
      T.loop.stop();
      T.loop = null;
    }

    $rEL('keypress', onKeypress);

    if (T.dustTimer) $cI(T.dustTimer);

    clearClouds(T);

    hideElement($('#d-tt'));
    hideElement($('#d-m'));
    hideElement($('#d-c'));
  }
}

const updateGround = (ground, x) => {
  ground.style.backgroundPositionX = (x % 960) + 'px';
};

const onKeypress = e => {
  const key = e.key;

  if (key === ' ') {
    mountScene('story');
  }
};

export default TitleScene;
