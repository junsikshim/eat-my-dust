import { imageAssets, Sprite, SpriteSheet, GameLoop } from 'kontra';

import Scene from './Scene';
import Character from '../Character';
import { getLogs, saveLog } from '../logs';
import Ghost from '../Ghost';
import { showElement, $ } from '../utils';
import {
  clearClouds,
  initClouds,
  renderClouds,
  startClouds,
  updateClouds
} from '../cloud';

const ACTION_CORRECT = 1;
const ACTION_INCORRECT = 2;
const ACTION_FINISH = 3;

const CHARACTER_OFFSET_X = 300;
const CHARACTER_WIDTH = 100;
const CHARACTER_HEIGHT = 100;

const CHARACTERS_IN_LINE = 40;

const Dom = {
  ground: document.getElementById('ground'),
  distance: document.getElementById('distance'),
  text: document.getElementById('text'),
  subText: document.getElementById('sub-text'),
  frame: document.getElementById('energy-frame'),
  bar: document.getElementById('energy-bar'),
  labelParent: document.getElementById('div-label')
};

class GameScene extends Scene {
  constructor(options) {
    super('game', options);
  }

  mount(data) {
    showElement($('#div-text'));
    showElement($('#div-distance'));
    showElement($('#div-energy'));

    const masterSheet = SpriteSheet({
      image: imageAssets['master'],
      frameWidth: 64,
      frameHeight: 64,
      animations: {
        run: {
          frames: '0..9',
          frameRate: 10
        },
        stand: {
          frames: [3, 8],
          frameRate: 3
        },
        skill: {
          frames: '0..9',
          frameRate: 20
        }
      }
    });

    const master = Sprite({
      x: CHARACTER_OFFSET_X,
      y: 270 - CHARACTER_HEIGHT,
      width: CHARACTER_WIDTH,
      height: CHARACTER_HEIGHT,
      animations: masterSheet.animations
    });

    const player = new Character({
      image: master,
      x: 0,
      maxDx: 10,
      onSkillEnd: () => {
        updateEnergyBar(player.energy);
      }
    });

    const state = {
      cursor: 0,
      line: {
        startCharIndex: 0,
        phrase: ''
      },
      isStarted: false
    };

    const ghostLogs = getLogs(4);

    const ghosts = ghostLogs.map(logs => {
      const image = Sprite({
        x: 0,
        y: 270 - CHARACTER_HEIGHT,
        width: CHARACTER_WIDTH,
        height: CHARACTER_HEIGHT,
        animations: masterSheet.animations
      });

      return new Ghost({
        image,
        x: 0,
        maxDx: 10,
        logs,
        player,
        offset: CHARACTER_OFFSET_X,
        name: logs.n,
        labelParent: Dom.labelParent
      });
    });

    initClouds(this);
    startClouds(this);

    // n - name
    // d - total distance
    // l - list of actions
    // t - time
    // a - action
    const log = {
      d: 0,
      l: []
    };

    const words = getWords(data.story.text);

    state.line = updateTextLines(state, words, state.cursor);
    state.cursor = updateCursor(state.line, state.cursor);

    // user-typing handler
    window.addEventListener('keypress', e => {
      e.preventDefault();

      const { line, cursor } = state;
      const { phrase, startCharIndex } = line;
      const c = e.key;

      const cursorChar = phrase.charAt(cursor - startCharIndex);
      const isCorrect = cursorChar === c;

      if (isCorrect) {
        // starts when the first character is correctly typed
        if (!state.isStarted) {
          state.isStarted = true;
          state.startTime = Date.now();

          startGhosts(ghosts);
        }

        const newCursor = cursor + 1;

        state.cursor = updateCursor(line, newCursor);

        // if the cursor was at the end of the line
        if (state.cursor >= line.startCharIndex + line.phrase.length) {
          state.line = updateTextLines(state, words, line.lastWordIndex + 1);
          state.cursor = updateCursor(state.line, state.cursor);
        }

        player.increaseEnergy();
        player.accelerate();

        log.l.push({
          t: Date.now() - state.startTime,
          a: ACTION_CORRECT
        });

        // check if the last character was correctly typed
        if (state.cursor === data.story.text.length) {
          log.d = state.d;

          player.finish(() => {
            log.l.push({
              t: Date.now() - state.startTime,
              a: ACTION_FINISH
            });

            log.n = new Date(state.startTime).toLocaleDateString();
            log.d = state.distance;

            saveLog(log);
          });
        }
      } else {
        // reset energy when there's a typo
        player.resetEnergy();

        log.l.push({
          t: Date.now() - state.startTime,
          a: ACTION_INCORRECT
        });
      }

      updateEnergyBar(player.energy);
    });

    const scene = this;
    const context = this.options.context;

    // game loop
    this.loop = GameLoop({
      update: function() {
        // slow down the player each frame
        player.decelerate();

        player.update();

        if (state.isStarted) {
          ghosts.forEach(g => g.update());
        }

        state.distance = (player.x / 200).toFixed(2);
        updateDistance(state.distance);

        updateGround(player.x);
        updateClouds(scene);
      },
      render: function() {
        context.save();
        context.globalAlpha = 0.4;
        ghosts.forEach(g => g.render(player));
        context.restore();

        player.render();

        renderClouds(scene);
      }
    });

    this.loop.start();
  }

  unmount() {
    if (this.loop) {
      this.loop.stop();
      this.loop = null;
    }

    clearClouds(this);
  }
}

function updateDistance(d) {
  Dom.distance.innerHTML = d + 'm';
}

function getWords(text) {
  return text
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/\s+/g, ' ')
    .split(' ');
}

function updateTextLines(state, words, wordIndex) {
  const line = getNextLine(
    state.line.startCharIndex + state.line.phrase.length - 1,
    words,
    wordIndex
  );
  updateLine(line.phrase);

  const subLine = getNextLine(-1, words, line.lastWordIndex + 1);
  updateSubLine(subLine.phrase);

  return line;
}

function getNextLine(lastCharIndex, words, fromWordIndex) {
  let index = fromWordIndex;
  let s = '';

  for (let i = fromWordIndex; i < words.length; i++) {
    const t = i === 0 ? words[i] : s + ' ' + words[i];

    if (t.length > CHARACTERS_IN_LINE)
      return {
        phrase: ltrim(s + ' '),
        startCharIndex: lastCharIndex + 1,
        lastWordIndex: index
      };
    else {
      s = t;
      index = i;
    }
  }

  return {
    phrase: ltrim(s),
    startCharIndex: lastCharIndex + 1,
    lastWordIndex: index
  };
}

function updateLine(html) {
  Dom.text.innerHTML = html;
}

function updateSubLine(html) {
  Dom.subText.innerHTML = html;
}

function updateCursor(line, cursor) {
  const { phrase, startCharIndex } = line;
  const indexInPhrase = cursor - startCharIndex;

  const pre = phrase.slice(0, indexInPhrase);
  const post = phrase.slice(indexInPhrase + 1);
  const c = phrase.charAt(indexInPhrase);
  const r =
    `<span class="correct">` +
    pre +
    `</span><span class="cursor">` +
    c +
    `</span>` +
    post;

  updateLine(r);

  return cursor;
}

function ltrim(s) {
  return s.replace(/^\s+/, '');
}

function updateEnergyBar(energy) {
  const width = Dom.frame.offsetWidth - 2;
  const calculatedWidth = Math.min(energy * (width / 100), width);

  Dom.bar.style.width = calculatedWidth + 'px';
}

function updateGround(x) {
  Dom.ground.style.backgroundPositionX = (-x % 960) + 'px';
}

function startGhosts(ghosts) {
  ghosts.forEach(g => {
    const logs = g.options.logs;

    logs.l.forEach(o => {
      const action = o.a;

      setTimeout(() => {
        switch (action) {
          case ACTION_CORRECT:
            g.increaseEnergy();
            g.accelerate();
            break;

          case ACTION_INCORRECT:
            g.resetEnergy();
            break;
        }
      }, o.t);
    });
  });
}

export default GameScene;
