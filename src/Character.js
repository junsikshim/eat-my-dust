const MODE_NORMAL = 0;
const MODE_IN_SKILL = 1;
const MODE_FINISH = 2;
const MODE_FINISHED = 3;

const ACCELERATE_SPEED = 3;
const DECELERATE_SPEED = 0.2;
const ENERGY_GAIN = 2;

export const SKILL_DURATION = 3500;

class Character {
  constructor(options) {
    this.options = options;
    this.image = options.image;
    this.x = options.x;
    this.dx = options.dx || 0;
    this.energy = 0;
    this.mode = MODE_NORMAL;

    this.playAnimation('stand');
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

        break;

      case MODE_FINISH:
        this.x += this.dx;

        if (this.dx < 0.2) {
          this.playAnimation('stand');
          this.mode = MODE_FINISHED;
          this.onFinish();
        } else {
          this.playAnimation('run');
        }

        break;
    }

    this.image.update();
  }

  render() {
    this.image.render();
  }

  accelerate() {
    switch (this.mode) {
      case MODE_NORMAL:
        this.dx = Math.min(this.dx + ACCELERATE_SPEED, this.options.maxDx);
        this.image.animations.run.frameRate = Math.min(this.dx, 10);

        break;
    }
  }

  decelerate() {
    switch (this.mode) {
      case MODE_NORMAL:
      case MODE_FINISH:
        this.dx = Math.max(this.dx - DECELERATE_SPEED, 0);
        this.image.animations.run.frameRate = Math.max(this.dx, 0);

        break;
    }
  }

  finish(onFinish) {
    this.mode = MODE_FINISH;
    this.onFinish = onFinish;
  }

  useSkill() {
    this.mode = MODE_IN_SKILL;
    this.dx = 20;
    this.playAnimation('skill');

    setTimeout(() => {
      this.mode = MODE_NORMAL;
      this.resetEnergy();

      if (this.options.onSkillEnd) this.options.onSkillEnd();
    }, 3500);
  }

  isInSkill() {
    return this.mode === MODE_IN_SKILL;
  }

  playAnimation(animation) {
    this.image.playAnimation(animation);
  }

  increaseEnergy() {
    switch (this.mode) {
      case MODE_NORMAL:
        this.energy += ENERGY_GAIN;

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
