import { imageAssets, Pool, Sprite } from 'kontra';

export const initDusts = scene => {
  scene.dustPool = Pool({
    create: Sprite,
    maxSize: 100
  });
};

export const createDust = scene => (x, y) => {
  scene.dustPool.get({
    x: x + 100 / 2 - 20,
    y: y + 100 - 2,
    dx: Math.random() * -1 - 1,
    dy: Math.random() * -0.5,
    width: Math.random() * 5,
    height: Math.random() * 5,
    rotation: Math.random() * Math.PI * 2,
    image: imageAssets['dust'],
    ttl: 100,
    type: 'dust'
  });
};

export const updateDusts = scene => {
  scene.dustPool.update();
};

export const renderDusts = scene => {
  const context = scene.options.context;
  const liveDusts = scene.dustPool.getAliveObjects();

  liveDusts.forEach(d => {
    const opacity = d.ttl / 80;

    context.save();
    context.globalAlpha = opacity;
    d.render();
    context.restore();
  });
};
