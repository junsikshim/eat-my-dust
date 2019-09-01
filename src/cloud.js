import { Pool, Sprite, imageAssets } from 'kontra';
import { $cI, $r, $sT } from './utils';

export const initClouds = scene => {
  // cloudPool
  scene.cP = Pool({
    create: Sprite,
    maxSize: 100
  });
};

export const startClouds = scene => {
  scene.createClouds = () => {
    createCloud(scene);

    // cloudTimer
    scene.cT = $sT(() => {
      scene.createClouds(scene);
    }, $r() * 1000 + 2000);
  };

  scene.createClouds();
};

const createCloud = scene => {
  scene.cP.get({
    x: 1000,
    y: $r() * 100 + 20,
    dx: $r() * -2 - 0.3,
    dy: 0,
    width: 52,
    height: 32,
    image: imageAssets['c'],
    ttl: 3000,
    type: 'cloud'
  });
};

export const updateClouds = (scene, dx) => {
  scene.cP.update(dx);
};

export const renderClouds = scene => {
  const context = scene.O.context;
  const liveClouds = scene.cP.getAliveObjects();

  liveClouds.forEach(c => {
    const opacity = c.dx / -2;

    context.save();
    context.globalAlpha = opacity;
    c.render();
    context.restore();
  });
};

export const clearClouds = scene => {
  $cI(scene.cT);
};