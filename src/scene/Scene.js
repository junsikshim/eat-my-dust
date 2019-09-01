class Scene {
  constructor(name, options) {
    this.name = name;
    this.O = options;
  }

  mount() {}

  unmount() {}
}

let currentScene = null;
const sceneMap = {};

export const mountScene = (name, data) => {
  if (currentScene) currentScene.unmount();

  currentScene = sceneMap[name];

  if (currentScene) currentScene.mount(data);
};

export const registerScene = (name, scene) => (sceneMap[name] = scene);

export default Scene;
