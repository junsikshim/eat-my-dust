import { imageAssets, Pool, Sprite } from 'kontra';

import { $r } from './utils';

export const initDusts = scene => {
  // dustPool
  scene.dP = Pool({
    create: Sprite,
    maxSize: 100
  });
};

export const createDust = scene => (x, y) => {
  const size = $r() * 5;

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

export const updateDusts = scene => {
  scene.dP.update();
};

export const renderDusts = scene => {
  const context = scene.O.context;
  const liveDusts = scene.dP.getAliveObjects();

  liveDusts.forEach(d => {
    const opacity = d.ttl / 80;

    context.save();
    context.globalAlpha = opacity;
    d.render();
    context.restore();
  });
};
