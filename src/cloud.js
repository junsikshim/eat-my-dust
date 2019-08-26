import { Pool, Sprite, imageAssets } from 'kontra';

export const initClouds = scene => {
  scene.cloudPool = Pool({
    create: Sprite,
    maxSize: 100
  });
};

export const startClouds = scene => {
  scene.createClouds = () => {
    createCloud(scene);

    scene.cloudTimer = window.setTimeout(() => {
      scene.createClouds(scene);
    }, Math.random() * 1000 + 2000);
  };

  scene.createClouds();
};

const createCloud = scene => {
  scene.cloudPool.get({
    x: 1000,
    y: Math.random() * 100 + 20,
    dx: Math.random() * -2 - 0.3,
    dy: 0,
    width: 52,
    height: 32,
    image: imageAssets['cloud'],
    ttl: 3000,
    type: 'cloud'
  });
};

export const updateClouds = scene => {
  scene.cloudPool.update();
};

export const renderClouds = scene => {
  const context = scene.options.context;
  const liveClouds = scene.cloudPool.getAliveObjects();

  liveClouds.forEach(c => {
    const opacity = c.dx / -2;

    context.save();
    context.globalAlpha = opacity;
    c.render();
    context.restore();
  });
};

export const clearClouds = scene => {
  window.clearInterval(scene.cloudTimer);
};
