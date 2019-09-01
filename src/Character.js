import { $ms, $mx, $sT } from './utils';

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

    T.O = options; // options
    T.image = options.image;
    T.x = options.x;
    T.dx = options.dx || 0;
    T.E = 0; // energy
    T.mode = MODE_NORMAL;

    T.play('stand');
  }

  update() {
    const T = this;

    switch (T.mode) {
      case MODE_NORMAL:
        T.x += T.dx;

        if (T.dx < 0.2) T.play('stand');
        else T.play('run');

        break;

      case MODE_IN_SKILL:
        T.x += T.dx;

        break;

      case MODE_FINISH:
        T.x += T.dx;

        if (T.dx < 0.2) {
          T.play('stand');
          T.mode = MODE_FINISHED;
          T.onFinish();
        } else {
          T.play('run');
        }

        break;
    }

    T.image.update();
  }

  render() {
    this.image.render();
  }

  acc() {
    const T = this;

    switch (T.mode) {
      case MODE_NORMAL:
        T.dx = $ms(T.dx + ACCELERATE_SPEED, T.O.maxDx);
        T.image.animations.run.frameRate = $ms(T.dx, 10);

        break;
    }
  }

  dec() {
    const T = this;

    switch (T.mode) {
      case MODE_NORMAL:
      case MODE_FINISH:
        T.dx = $mx(T.dx - DECELERATE_SPEED, 0);
        T.image.animations.run.frameRate = $mx(T.dx, 0);

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
    T.play('skill');

    $sT(() => {
      T.mode = MODE_NORMAL;
      T.rE();

      if (T.O.onSkillEnd) T.O.onSkillEnd();
    }, 3500);
  }

  isInSkill() {
    return this.mode === MODE_IN_SKILL;
  }

  play(animation) {
    this.image.playAnimation(animation);
  }

  // increaseEnergy
  incE() {
    const T = this;

    switch (T.mode) {
      case MODE_NORMAL:
        T.E += ENERGY_GAIN;

        if (T.E >= 100) {
          T.useSkill();
        }

        break;
    }
  }

  // resetEnergy
  rE() {
    switch (this.mode) {
      case MODE_NORMAL:
        this.E = 0;
        break;
    }
  }
}

export default Character;