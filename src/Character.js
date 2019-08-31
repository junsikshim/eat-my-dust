import { $sT } from './utils';

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
    const T = this;

    T.options = options;
    T.image = options.image;
    T.x = options.x;
    T.dx = options.dx || 0;
    T.energy = 0;
    T.mode = MODE_NORMAL;

    T.playAnimation('stand');
  }

  update() {
    const T = this;

    switch (T.mode) {
      case MODE_NORMAL:
        T.x += T.dx;

        if (T.dx < 0.2) T.playAnimation('stand');
        else T.playAnimation('run');

        break;

      case MODE_IN_SKILL:
        T.x += T.dx;

        break;

      case MODE_FINISH:
        T.x += T.dx;

        if (T.dx < 0.2) {
          T.playAnimation('stand');
          T.mode = MODE_FINISHED;
          T.onFinish();
        } else {
          T.playAnimation('run');
        }

        break;
    }

    T.image.update();
  }

  render() {
    this.image.render();
  }

  accelerate() {
    const T = this;

    switch (T.mode) {
      case MODE_NORMAL:
        T.dx = Math.min(T.dx + ACCELERATE_SPEED, T.options.maxDx);
        T.image.animations.run.frameRate = Math.min(T.dx, 10);

        break;
    }
  }

  decelerate() {
    const T = this;

    switch (T.mode) {
      case MODE_NORMAL:
      case MODE_FINISH:
        T.dx = Math.max(T.dx - DECELERATE_SPEED, 0);
        T.image.animations.run.frameRate = Math.max(T.dx, 0);

        break;
    }
  }

  finish(onFinish) {
    this.mode = MODE_FINISH;
    this.onFinish = onFinish;
  }

  useSkill() {
    const T = this;

    T.mode = MODE_IN_SKILL;
    T.dx = 20;
    T.playAnimation('skill');

    $sT(() => {
      T.mode = MODE_NORMAL;
      T.resetEnergy();

      if (T.options.onSkillEnd) T.options.onSkillEnd();
    }, 3500);
  }

  isInSkill() {
    return this.mode === MODE_IN_SKILL;
  }

  playAnimation(animation) {
    this.image.playAnimation(animation);
  }

  increaseEnergy() {
    const T = this;

    switch (T.mode) {
      case MODE_NORMAL:
        T.energy += ENERGY_GAIN;

        if (T.energy >= 100) {
          T.useSkill();
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
