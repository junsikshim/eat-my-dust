import { $ms, $mx, $sT } from './utils';

let MODE_NORMAL = 0;
let MODE_IN_SKILL = 1;
let MODE_FINISH = 2;
let MODE_FINISHED = 3;

let ACCELERATE_SPEED = 3;
let DECELERATE_SPEED = 0.2;
let ENERGY_GAIN = 2;

export let SKILL_DURATION = 3500;

class Character {
  constructor(options) {
    let T = this;

    T.O = options; // options
    T.image = options.image;
    T.x = options.x;
    T.dx = options.dx || 0;
    T.E = 0; // energy
    T.mode = MODE_NORMAL;

    T.play('stand');
  }

  update() {
    let T = this;

    // move the character
    T.x += T.dx;

    switch (T.mode) {
      case MODE_NORMAL:
        // change animation based on current speed
        if (T.dx < 0.2) T.play('stand');
        else T.play('run');

        break;

      case MODE_FINISH:
        // when finished, let the character finish running
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
    let T = this;

    switch (T.mode) {
      case MODE_NORMAL:
        // calculate speed
        T.dx = $ms(T.dx + ACCELERATE_SPEED, T.O.maxDx);
        // calculate framerate based on the speed
        T.image.animations.run.frameRate = $ms(T.dx, 10);

        break;
    }
  }

  dec() {
    let T = this;

    switch (T.mode) {
      case MODE_NORMAL:
      case MODE_FINISH:
        // calculate speed
        T.dx = $mx(T.dx - DECELERATE_SPEED, 0);
        // calculate framerate based on the speed
        T.image.animations.run.frameRate = $mx(T.dx, 0);

        break;
    }
  }

  finish(onFinish) {
    this.mode = MODE_FINISH;
    this.onFinish = onFinish;
  }

  useSkill() {
    let T = this;

    T.mode = MODE_IN_SKILL;
    T.dx = 20;
    T.play('skill');

    // the player has another skill effect
    if (T.O.scene) T.O.scene.showSkillEffect();

    $sT(() => {
      T.mode = MODE_NORMAL;
      T.rE();

      if (T.O.onSkillEnd) T.O.onSkillEnd();
    }, SKILL_DURATION);
  }

  isInSkill() {
    return this.mode === MODE_IN_SKILL;
  }

  play(animation) {
    this.image.playAnimation(animation);
  }

  // increaseEnergy
  incE() {
    let T = this;

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
