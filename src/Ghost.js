import Character from './Character';
import { showElement, $c, aC } from './utils';

var LABEL_OFFSET = 60;

class Ghost extends Character {
  constructor(options) {
    super(options);

    var T = this;

    T.logs = options.logs;
    T.player = options.player;

    var l = (T.label = createLabel(options.name));
    options.lP.appendChild(l);

    if (T.logs.isBot) aC(l, 'bot');

    var a = (T.arrow = createArrow());
    options.lP.appendChild(a);
  }

  render() {
    var T = this;

    T.image.x = T.x - T.player.x + T.O.offset;
    T.image.render();

    var centerX = T.image.x + 50;
    var labelCenterX = getBoundedX(centerX);

    var lS = T.label.style;
    lS.left = labelCenterX + 'px';

    var aS = T.arrow.style;
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

var createLabel = text => {
  var node = $c('div');
  aC(node, 'name');
  node.innerHTML = text;

  return node;
};

var createArrow = () => {
  var node = $c('div');
  aC(node, 'arrow');

  return node;
};

var getBoundedX = x => {
  if (x < LABEL_OFFSET) return LABEL_OFFSET;

  if (x > 960 - LABEL_OFFSET) return 960 - LABEL_OFFSET;

  return x;
};

var calculateArrowX = x => {
  if (x >= LABEL_OFFSET && x <= 960 - LABEL_OFFSET) {
    return x;
  }

  if (x < LABEL_OFFSET) {
    return LABEL_OFFSET;
  }

  if (x > 960 - LABEL_OFFSET) return 960 - LABEL_OFFSET;
};

var calculateArrowAngle = (aX, aY, cX, cY) => {
  var r = Math.atan2(cY - aY, cX - aX) - Math.PI / 2;

  if (r < -1.4) return -1.4;
  if (r > 1.4) return 1.4;
  return r;
};

export default Ghost;
