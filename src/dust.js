import { Sprite, imageAssets, Pool } from './kontra/kontra';
import { $r } from './utils';

export let initDusts = scene => {
  // dustPool
  scene.dP = Pool({
    create: Sprite,
    maxSize: 100
  });
};

export let createDust = scene => (x, y) => {
  let size = $r() * 5;

  // create a dust randomly
  scene.dP.get({
    x: x + 100 / 2 - 20,
    y: y + 100 - 2,
    dx: $r() * -1 - 1,
    dy: $r() * -0.5,
    width: size,
    height: size,
    image: imageAssets['d'],
    ttl: 100,
    type: 'dust'
  });
};

export let updateDusts = scene => {
  scene.dP.update();
};

export let renderDusts = scene => {
  let context = scene.O.context;
  let liveDusts = scene.dP.getAliveObjects();

  liveDusts.forEach(d => {
    let opacity = d.ttl / 80;

    context.save();
    context.globalAlpha = opacity;
    d.render();
    context.restore();
  });
};
