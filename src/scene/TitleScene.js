import { GameLoop, imageAssets, Sprite, SpriteSheet, Pool } from 'kontra';

import Scene, { mountScene } from './Scene';
import { $, showElement, hideElement } from '../utils';

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

    const dustPool = Pool({
      create: Sprite,
      maxSize: 100
    });

    const cloudPool = Pool({
      create: Sprite,
      maxSize: 100
    });

    window.addEventListener('keypress', onKeypress);

    this.dustTimer = window.setInterval(() => {
      dustPool.get({
        x: master.x + CHARACTER_WIDTH / 2 - 20,
        y: master.y + CHARACTER_HEIGHT - 2,
        dx: Math.random() * -1 - 1,
        dy: Math.random() * -0.5,
        width: Math.random() * 5,
        height: Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        image: imageAssets['dust'],
        ttl: 100,
        type: 'dust'
      });
    }, 50);

    this.createClouds(cloudPool, imageAssets['cloud']);

    const ground = $('#ground');
    let groundX = 0;

    const context = this.options.context;

    this.loop = GameLoop({
      update: function() {
        master.update();
        dustPool.update();
        cloudPool.update();

        groundX -= 4;
        updateGround(ground, groundX);
      },
      render: function() {
        master.render();

        const liveDusts = dustPool.getAliveObjects();

        liveDusts.forEach(d => {
          const opacity = d.ttl / 80;

          context.save();
          context.globalAlpha = opacity;
          d.render();
          context.restore();
        });

        const liveClouds = cloudPool.getAliveObjects();

        liveClouds.forEach(c => {
          const opacity = c.dx / -2;

          context.save();
          context.globalAlpha = opacity;
          c.render();
          context.restore();
        });
      }
    });

    this.loop.start();
  }

  createClouds(cloudPool, cloudImage) {
    createCloud(cloudPool, cloudImage);

    this.cloudTimer = window.setTimeout(() => {
      this.createClouds(cloudPool, cloudImage);
    }, Math.random() * 1000 + 2000);
  }

  unmount() {
    if (this.loop) {
      this.loop.stop();
      this.loop = null;
    }

    window.removeEventListener('keypress', onKeypress);

    if (this.dustTimer) window.clearInterval(this.dustTimer);
    if (this.cloudTimer) window.clearInterval(this.cloudTimer);

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

const createCloud = (cloudPool, cloudImage) => {
  cloudPool.get({
    x: 1000,
    y: Math.random() * 100 + 20,
    dx: Math.random() * -2 - 0.3,
    dy: 0,
    width: 52,
    height: 32,
    image: cloudImage,
    ttl: 1000,
    type: 'cloud'
  });
};

export default TitleScene;
