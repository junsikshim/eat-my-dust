import Character from './Character';
import { showElement, $c } from './utils';

const LABEL_OFFSET = 60;

class Ghost extends Character {
  constructor(options) {
    super(options);

    const T = this;

    T.logs = options.logs;
    T.player = options.player;

    T.label = createLabel(options.name);
    options.labelParent.appendChild(T.label);
    T.labelWidth = T.label.offsetWidth;

    T.arrow = createArrow();
    options.labelParent.appendChild(T.arrow);
    T.arrowWidth = T.arrow.offsetWidth;
  }

  render() {
    const T = this;

    T.image.x = T.x - T.player.x + T.options.offset;
    T.image.render();

    const centerX = T.image.x + 50;
    const labelCenterX = getBoundedX(centerX);

    T.label.style.left = labelCenterX - T.labelWidth / 2 + 'px';
    T.label.style.top = '112px';

    T.arrow.style.left = calculateArrowX(centerX) - T.arrowWidth / 2 + 'px';

    T.arrow.style.transform = `rotate(${calculateArrowAngle(
      labelCenterX,
      120,
      centerX,
      250
    )}rad)`;

    T.arrow.style.top = '144px';
  }

  showLabel() {
    showElement(this.label);
    showElement(this.arrow);
  }
}

const createLabel = text => {
  const node = $c('div');
  node.classList.add('name');
  node.innerHTML = text;

  return node;
};

const createArrow = () => {
  const node = $c('div');
  node.classList.add('arrow');

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
