import Character from './Character';
import { showElement, $c, aC } from './utils';

let LABEL_OFFSET = 60;

class Ghost extends Character {
  constructor(options) {
    super(options);

    let T = this;

    T.logs = options.logs;
    T.player = options.player;

    let l = (T.label = createLabel(options.name));
    options.lP.appendChild(l);

    if (T.logs.isBot) aC(l, 'bot');

    let a = (T.arrow = createArrow());
    options.lP.appendChild(a);
  }

  render() {
    let T = this;

    T.image.x = T.x - T.player.x + T.O.offset;
    T.image.render();

    let centerX = T.image.x + 50;
    let labelCenterX = getBoundedX(centerX);

    let lS = T.label.style;
    lS.left = labelCenterX + 'px';

    let aS = T.arrow.style;
    aS.left = calculateArrowX(centerX) + 'px';
    aS.transform = `rotate(${calculateArrowAngle(
      labelCenterX,
      120,
      centerX,
      250
    )}rad)`;
  }

  showLabel() {
    showElement(this.label);
    showElement(this.arrow);
  }
}

let createLabel = text => {
  let node = $c('div');
  aC(node, 'name');
  node.innerHTML = text;

  return node;
};

let createArrow = () => {
  let node = $c('div');
  aC(node, 'arrow');

  return node;
};

let getBoundedX = x => {
  if (x < LABEL_OFFSET) return LABEL_OFFSET;

  if (x > 960 - LABEL_OFFSET) return 960 - LABEL_OFFSET;

  return x;
};

let calculateArrowX = x => {
  if (x >= LABEL_OFFSET && x <= 960 - LABEL_OFFSET) {
    return x;
  }

  if (x < LABEL_OFFSET) {
    return LABEL_OFFSET;
  }

  if (x > 960 - LABEL_OFFSET) return 960 - LABEL_OFFSET;
};

let calculateArrowAngle = (aX, aY, cX, cY) => {
  let r = Math.atan2(cY - aY, cX - aX) - Math.PI / 2;

  if (r < -1.4) return -1.4;
  if (r > 1.4) return 1.4;
  return r;
};

export default Ghost;
