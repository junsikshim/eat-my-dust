import Character from './Character';
import { showElement, $c, aC } from './utils';

const LABEL_OFFSET = 60;

class Ghost extends Character {
  constructor(options) {
    super(options);

    const T = this;

    T.logs = options.logs;
    T.player = options.player;

    const l = (T.label = createLabel(options.name));
    options.lP.appendChild(l);

    if (T.logs.isBot) aC(l, 'bot');

    const a = (T.arrow = createArrow());
    options.lP.appendChild(a);
  }

  render() {
    const T = this;

    T.image.x = T.x - T.player.x + T.O.offset;
    T.image.render();

    const centerX = T.image.x + 50;
    const labelCenterX = getBoundedX(centerX);

    const lS = T.label.style;
    lS.left = labelCenterX + 'px';
    lS.top = '112px';

    const aS = T.arrow.style;
    aS.left = calculateArrowX(centerX) + 'px';
    aS.transform = `rotate(${calculateArrowAngle(
      labelCenterX,
      120,
      centerX,
      250
    )}rad)`;
    aS.top = '144px';
  }

  showLabel() {
    showElement(this.label);
    showElement(this.arrow);
  }
}

const createLabel = text => {
  const node = $c('div');
  aC(node, 'name');
  node.innerHTML = text;

  return node;
};

const createArrow = () => {
  const node = $c('div');
  aC(node, 'arrow');

  return node;
};

const getBoundedX = x => {
  if (x < LABEL_OFFSET) return LABEL_OFFSET;

  if (x > 960 - LABEL_OFFSET) return 960 - LABEL_OFFSET;

  return x;
};

const calculateArrowX = x => {
  if (x >= LABEL_OFFSET && x <= 960 - LABEL_OFFSET) {
    return x;
  }

  if (x < LABEL_OFFSET) {
    return LABEL_OFFSET;
  }

  if (x > 960 - LABEL_OFFSET) return 960 - LABEL_OFFSET;
};

const calculateArrowAngle = (aX, aY, cX, cY) => {
  const r = Math.atan2(cY - aY, cX - aX) - Math.PI / 2;

  if (r < -1.4) return -1.4;
  if (r > 1.4) return 1.4;
  return r;
};

export default Ghost;
