import { imageAssets, Sprite, SpriteSheet, GameLoop } from 'kontra';

import Scene, { mountScene } from './Scene';
import Character, { SKILL_DURATION } from '../Character';
import { getLogs, saveLog } from '../logs';
import Ghost from '../Ghost';
import {
  showElement,
  hideElement,
  $,
  $c,
  $rAF,
  $sT,
  $cT,
  $aEL,
  $rEL
} from '../utils';
import {
  clearClouds,
  initClouds,
  renderClouds,
  startClouds,
  updateClouds
} from '../cloud';
import { createDust, initDusts, renderDusts, updateDusts } from '../dust';

const ACTION_CORRECT = 1;
const ACTION_INCORRECT = 2;
const ACTION_FINISH = 3;

const CHARACTER_OFFSET_X = 300;
const CHARACTER_WIDTH = 100;
const CHARACTER_HEIGHT = 100;

const CHARACTERS_IN_LINE = 40;

const Dom = {
  ground: $('#g'),
  distance: $('#d'),
  textContainer: $('#d-t'),
  text: $('#t'),
  subText: $('#st'),
  frame: $('#ef'),
  bar: $('.eb'),
  labelParent: $('#d-l')
};

class GameScene extends Scene {
  constructor(options) {
    super('game', options);
  }

  mount(data) {
    const T = this;

    showElement($('#d-t'));
    showElement($('#d-d'));
    showElement($('#d-e'));
    showElement($('#d-l'));
    showElement($('#d-pm'));
    showElement($('#d-gm'));

    // clean up labels
    $('#d-l').innerHTML = '';

    const masterSheet = SpriteSheet({
      image: imageAssets['m'],
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
          frames: '10..19',
          frameRate: 15
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

    // update initial energy
    updateEnergyBar(player.energy);

    const state = {
      cursor: 0,
      line: {
        startCharIndex: 0,
        phrase: ''
      },
      isStarted: false,
      isFinished: false
    };

    const ghostLogs = getLogs(data.story.id)(3);
    ghostLogs.sort((a, b) => b.d - a.d);

    const ghosts = ghostLogs.map((logs, i) => {
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
        name: i + 1,
        labelParent: Dom.labelParent
      });
    });

    initDusts(T);

    initClouds(T);
    startClouds(T);

    // n - name
    // d - total distance
    // l - actions [time-diff1, action1, time-diff2, action2, ...]
    const log = {
      d: 0,
      l: []
    };

    const words = getWords(data.story.text);

    state.line = updateTextLines(state, words, state.cursor);
    state.cursor = updateCursor(state.line, state.cursor);

    const createDustAt = createDust(this);

    this.keyPressHandler = e => {
      e.preventDefault();

      const { line, cursor } = state;
      const { phrase, startCharIndex } = line;
      const c = e.key;

      if (c === 'Enter') return;

      if (state.isFinished) return;

      const now = Date.now();
      const cursorChar = phrase.charAt(cursor - startCharIndex);
      const isCorrect = cursorChar === c;

      if (isCorrect) {
        // starts when the first character is correctly typed
        if (!state.isStarted) {
          state.isStarted = true;
          state.startTime = now;
          state.lastTime = state.startTime;

          startGhosts(ghosts);

          hideElement($('#d-pm'));
        }

        const newCursor = cursor + 1;

        state.cursor = updateCursor(line, newCursor);

        // if the cursor was at the end of the line
        if (state.cursor >= line.startCharIndex + line.phrase.length) {
          state.line = updateTextLines(state, words, line.lastWordIndex + 1);
          state.cursor = updateCursor(state.line, state.cursor);
        }

        if (player.isInSkill()) {
          state.distance += 1;
          createPlus1Effect($('.cursor'));
        } else {
          player.increaseEnergy();
          updateEnergyBar(player.energy);
          player.accelerate();
        }

        log.l.push(now - state.lastTime);
        log.l.push(ACTION_CORRECT);

        createDustAt(master.x, master.y);

        // end of the story
        if (!state.line.phrase) {
          state.isFinished = true;

          $sT(
            () => {
              const distances = ghostLogs.map(l => +l.d);
              distances.sort((a, b) => b - a);

              const first = distances[0];
              const r = $('#d-r');

              if (state.distance > first) {
                r.innerHTML = `New Record!<br />${state.distance}m`;
              } else {
                r.innerHTML = `You ran<br />${state.distance}m`;
              }

              showElement(r);

              log.d = state.d;

              player.finish(() => {
                log.l.push(now - state.lastTime);
                log.l.push(ACTION_FINISH);
                log.n = new Date(state.startTime).toLocaleDateString();
                log.d = state.distance;

                saveLog(data.story.id)(log);
              });
            },
            player.isInSkill() ? SKILL_DURATION + 1000 : 1000
          );
        }
      } else {
        // reset energy when there's a typo
        player.resetEnergy();
        updateEnergyBar(player.energy, true);
        showWarningAtCursor($('.cursor'), state);

        log.l.push(now - state.lastTime);
        log.l.push(ACTION_INCORRECT);
      }

      state.lastTime = now;
    };

    // character-typing handler
    $aEL('keypress', T.keyPressHandler);

    T.keyDownHandler = e => {
      switch (e.key) {
        case 'Escape':
          mountScene('title');
          break;
      }
    };

    $aEL('keydown', T.keyDownHandler);

    const context = T.options.context;

    // game loop
    T.loop = GameLoop({
      update: function() {
        // slow down the player each frame
        player.decelerate();

        player.update();

        if (state.isStarted) {
          ghosts.forEach(g => {
            g.decelerate();
            g.update();
          });
        }

        state.distance = (player.x / 200).toFixed(2);
        updateDistance(state.distance);

        updateGround(player.x);
        updateClouds(T, player.isInSkill() ? 3 : 1);
        updateDusts(T);
      },
      render: function() {
        context.save();
        context.globalAlpha = 0.4;
        ghosts.forEach(g => g.render(player));
        context.restore();

        player.render();

        renderClouds(T);
        renderDusts(T);
      }
    });

    T.loop.start();
  }

  unmount() {
    const T = this;

    if (T.loop) {
      T.loop.stop();
      T.loop = null;
    }

    $rEL('keypress', T.keyPressHandler);
    $rEL('keydown', T.keyDownHandler);

    clearClouds(T);

    hideElement($('#d-t'));
    hideElement($('#d-d'));
    hideElement($('#d-e'));
    hideElement($('#d-l'));
    hideElement($('#d-pm'));
    hideElement($('#d-r'));
    hideElement($('#d-gm'));
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

function updateEnergyBar(energy, reset = false) {
  if (reset) {
    const clone = Dom.bar.cloneNode();
    const parent = Dom.bar.parentNode;

    clone.removeAttribute('id');
    parent.appendChild(clone);
    clone.classList.add('effect');

    $rAF(() => {
      clone.classList.add('dropped');
    });

    $sT(() => {
      parent.removeChild(clone);
    }, 1000);
  }
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
    const list = logs.l;
    let time = 0;

    for (let i = 0; i < list.length; i += 2) {
      const diff = list[i];
      const action = list[i + 1];

      time += diff;

      $sT(() => {
        switch (action) {
          case ACTION_CORRECT:
            g.increaseEnergy();
            g.accelerate();
            break;

          case ACTION_INCORRECT:
            g.resetEnergy();
            break;
        }
      }, time);
    }

    g.showLabel();
  });
}

function showWarningAtCursor(cursorElement, state) {
  if (state.cursorTimer) {
    $cT(state.cursorTimer);
    cursorElement.classList.remove('warn');
  }

  $rAF(() => {
    $rAF(() => {
      cursorElement.classList.add('warn');

      state.cursorTimer = $sT(() => {
        cursorElement.classList.remove('warn');
      }, 500);
    });
  });
}

function createPlus1Effect(cursorElement) {
  const x = cursorElement.offsetLeft;

  const elem = $c('span');
  elem.classList.add('effect', 'points');
  elem.innerHTML = '+1';
  elem.style.left = x - 23 + 'px';
  Dom.textContainer.appendChild(elem);

  $sT(() => {
    Dom.textContainer.removeChild(elem);
  }, 1000);
}

export default GameScene;
