import { Sprite, SpriteSheet, GameLoop, imageAssets } from '../kontra/kontra';
import Scene, { mountScene } from './Scene';
import {
  $,
  showElement,
  hideElement,
  $aEL,
  $rEL,
  $sI,
  $cI,
  KEYPRESS
} from '../utils';
import {
  clearClouds,
  initClouds,
  renderClouds,
  startClouds,
  updateClouds
} from '../cloud';
import { createDust, initDusts, renderDusts, updateDusts } from '../dust';

let CHARACTER_OFFSET_X = 300;
let CHARACTER_WIDTH = 100;
let CHARACTER_HEIGHT = 100;

class TitleScene extends Scene {
  constructor(options) {
    super('title', options);
  }

  mount() {
    let T = this;

    showElement($('#d-tt'));
    showElement($('#d-m'));
    showElement($('#d-c'));

    let masterSheet = SpriteSheet({
      image: imageAssets['m'],
      frameWidth: 32,
      frameHeight: 32,
      animations: {
        run: {
          frames: '0..9',
          frameRate: 20
        }
      }
    });

    let master = Sprite({
      x: CHARACTER_OFFSET_X,
      y: 270 - CHARACTER_HEIGHT,
      width: CHARACTER_WIDTH,
      height: CHARACTER_HEIGHT,
      animations: masterSheet.animations
    });

    master.playAnimation('run');

    initDusts(T);

    $aEL(KEYPRESS, onKeypress);

    let createDustAt = createDust(T);

    T.dT = $sI(() => {
      createDustAt(master.x, master.y);
    }, 50);

    initClouds(T);
    startClouds(T);

    let ground = $('#g');
    let groundX = 0;

    T.L = GameLoop({
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

    T.L.start();
  }

  unmount() {
    let T = this;

    if (T.L) {
      T.L.stop();
      T.L = null;
    }

    $rEL(KEYPRESS, onKeypress);

    if (T.dT) $cI(T.dT);

    clearClouds(T);

    hideElement($('#d-tt'));
    hideElement($('#d-m'));
    hideElement($('#d-c'));
  }
}

let updateGround = (ground, x) => {
  ground.style.backgroundPositionX = (x % 960) + 'px';
};

let onKeypress = e => {
  let key = e.key;

  if (key === ' ') {
    mountScene('story');
  }
};

export default TitleScene;
