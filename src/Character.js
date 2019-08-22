class Character {
  constructor(options) {
    this.image = options.image;
    this.x = options.x;
    this.dx = options.dx;
  }

  update() {
    this.image.update();
    this.x += this.dx;
  }

  render() {
    this.image.render();
  }
}

export default Character;