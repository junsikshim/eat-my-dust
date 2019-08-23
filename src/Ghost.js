class Ghost {
  constructor(options) {
    this.options = options;
    this.image = options.image;
    this.x = options.x;
    this.dx = options.dx;
  }

  update() {
    this.x += this.dx;
    this.image.update();
  }

  render(player) {
    this.image.x = this.x - player.x;
    this.image.render();
  }
}

export default Ghost;
