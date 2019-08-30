import Character from './Character';
import { showElement, $c } from './utils';

const LABEL_OFFSET = 60;

class Ghost extends Character {
  constructor(options) {
    super(options);

    this.logs = options.logs;
    this.player = options.player;

    this.label = createLabel(options.name);
    options.labelParent.appendChild(this.label);
    this.labelWidth = this.label.offsetWidth;

    this.arrow = createArrow();
    options.labelParent.appendChild(this.arrow);
    this.arrowWidth = this.arrow.offsetWidth;
  }

  render() {
    this.image.x = this.x - this.player.x + this.options.offset;
    this.image.render();

    const centerX = this.image.x + 50;
    const labelCenterX = getBoundedX(centerX);

    this.label.style.left = labelCenterX - this.labelWidth / 2 + 'px';
    this.label.style.top = '112px';

    this.arrow.style.left =
      calculateArrowX(centerX) - this.arrowWidth / 2 + 'px';
    this.arrow.style.transform = `rotate(${calculateArrowAngle(
      labelCenterX,
      120,
      centerX,
      250
    )}rad)`;
    this.arrow.style.top = '144px';
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
