import { GameLoop, imageAssets, Sprite, SpriteSheet, Pool } from 'kontra';

import Scene, { mountScene } from './Scene';
import { $, showElement, hideElement } from '../utils';
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
    showElement($('#div-title'));
    showElement($('#div-message'));
    showElement($('#div-credits'));

    const masterSheet = SpriteSheet({
      image: imageAssets['master'],
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

    initDusts(this);

    window.addEventListener('keypress', onKeypress);

    const createDustAt = createDust(this);

    this.dustTimer = window.setInterval(() => {
      createDustAt(master.x, master.y);
    }, 50);

    initClouds(this);
    startClouds(this);

    const ground = $('#ground');
    let groundX = 0;

    const scene = this;

    this.loop = GameLoop({
      update: function() {
        master.update();

        updateDusts(scene);
        updateClouds(scene);

        groundX -= 4;
        updateGround(ground, groundX);
      },
      render: function() {
        master.render();

        renderDusts(scene);
        renderClouds(scene);
      }
    });

    this.loop.start();
  }

  unmount() {
    if (this.loop) {
      this.loop.stop();
      this.loop = null;
    }

    window.removeEventListener('keypress', onKeypress);

    if (this.dustTimer) window.clearInterval(this.dustTimer);

    clearClouds(this);

    hideElement($('#div-title'));
    hideElement($('#div-message'));
    hideElement($('#div-credits'));
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
