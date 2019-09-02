import { imageAssets, Pool, Sprite } from 'kontra';

import { $r } from './utils';

export var initDusts = scene => {
  // dustPool
  scene.dP = Pool({
    create: Sprite,
    maxSize: 100
  });
};

export var createDust = scene => (x, y) => {
  var size = $r() * 5;

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

export var updateDusts = scene => {
  scene.dP.update();
};

export var renderDusts = scene => {
  var context = scene.O.context;
  var liveDusts = scene.dP.getAliveObjects();

  liveDusts.forEach(d => {
    var opacity = d.ttl / 80;

    context.save();
    context.globalAlpha = opacity;
    d.render();
    context.restore();
  });
};
