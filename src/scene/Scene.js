class Scene {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  mount() {}

  unmount() {}
}

let currentScene = null;
const sceneMap = {};

export const mountScene = name => {
  if (currentScene) currentScene.unmount();

  currentScene = sceneMap[name];

  if (currentScene) currentScene.mount();
};

export const registerScene = (name, scene) => (sceneMap[name] = scene);

export default Scene;
