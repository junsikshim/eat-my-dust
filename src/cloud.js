import { Sprite, imageAssets, Pool } from './kontra/kontra';
import { $cI, $r, $sT } from './utils';

export let initClouds = scene => {
  // cloudPool
  scene.cP = Pool({
    create: Sprite,
    maxSize: 100
  });
};

export let startClouds = scene => {
  scene.createClouds = () => {
    createCloud(scene);

    // cloudTimer
    scene.cT = $sT(() => {
      scene.createClouds(scene);
    }, $r() * 1000 + 2000);
  };

  scene.createClouds();
};

let createCloud = scene => {
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

export let updateClouds = (scene, dx) => {
  scene.cP.update(dx);
};

export let renderClouds = scene => {
  let context = scene.O.context;
  let liveClouds = scene.cP.getAliveObjects();

  liveClouds.forEach(c => {
    let opacity = c.dx / -2;

    context.save();
    context.globalAlpha = opacity;
    c.render();
    context.restore();
  });
};

export let clearClouds = scene => {
  $cI(scene.cT);
};
