import Character from './Character';

class Ghost extends Character {
  constructor(options) {
    super(options);

    this.logs = options.logs;
    this.player = options.player;
  }

  render() {
    this.image.x = this.x - this.player.x + this.options.offset;
    this.image.render();
  }
}

export default Ghost;
