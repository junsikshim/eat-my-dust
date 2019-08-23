const MODE_NORMAL = 0;
const MODE_IN_SKILL = 1;

class Character {
  constructor(options) {
    this.options = options;
    this.image = options.image;
    this.x = options.x;
    this.dx = options.dx || 0;
    this.energy = 0;
    this.mode = MODE_NORMAL;
  }

  update() {
    switch (this.mode) {
      case MODE_NORMAL:
        this.x += this.dx;

        if (this.dx < 0.2) this.playAnimation('stand');
        else this.playAnimation('run');

        break;

      case MODE_IN_SKILL:
        this.x += this.dx;
    }

    this.image.update();
  }

  render() {
    this.image.render();
  }

  accelerate() {
    switch (this.mode) {
      case MODE_NORMAL:
        this.dx = Math.min(this.dx + 4, this.options.maxDx);
        this.image.animations.run.frameRate = Math.min(this.dx, 10);

        break;
    }
  }

  decelerate() {
    switch (this.mode) {
      case MODE_NORMAL:
        this.dx = Math.max(this.dx - 0.3, 0);
        this.image.animations.run.frameRate = Math.max(this.dx, 0);

        break;
    }
  }

  useSkill() {
    this.mode = MODE_IN_SKILL;
    this.dx = 30;
    this.playAnimation('skill');

    setTimeout(() => {
      this.mode = MODE_NORMAL;
      this.resetEnergy();

      if (this.options.onSkillEnd) this.options.onSkillEnd();
    }, 3000);
  }

  playAnimation(animation) {
    this.image.playAnimation(animation);
  }

  increaseEnergy() {
    switch (this.mode) {
      case MODE_NORMAL:
        this.energy += 2;

        if (this.energy >= 100) {
          this.useSkill();
        }

        break;
    }
  }

  resetEnergy() {
    switch (this.mode) {
      case MODE_NORMAL:
        this.energy = 0;
        break;
    }
  }
}

export default Character;
