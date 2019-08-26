import Character from './Character';

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
  }

  render() {
    this.image.x = this.x - this.player.x + this.options.offset;
    this.image.render();

    this.label.style.left =
      getBoundedValue(this.image.x, this.labelWidth) + 'px';
    this.label.style.top = '120px';

    this.arrow.style.left = calculateArrowX(this.image.x) + 'px';
    this.arrow.style.top = '144px';
  }
}

const createLabel = text => {
  const node = document.createElement('div');
  node.classList.add('name');
  node.innerHTML = text;

  return node;
};

const createArrow = () => {
  const node = document.createElement('div');
  node.classList.add('arrow');

  return node;
};

const getBoundedValue = (value, width) => {
  if (value < 20) return 20;

  if (value > 960 - 20 - width) return 960 - 20 - width;

  return value + 11;
};

const calculateArrowX = x => {
  if (x >= 40 && x <= 960 - 40) {
    return x + 50 - 9;
  }

  if (x < 40) {
    return 40;
  }

  if (x > 960 - 40) return 960 - 40;
};

export default Ghost;
