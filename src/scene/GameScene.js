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
  $rEL,
  $ms,
  KEYPRESS,
  KEYDOWN,
  aC,
  rC
} from '../utils';
import {
  clearClouds,
  initClouds,
  renderClouds,
  startClouds,
  updateClouds
} from '../cloud';
import { createDust, initDusts, renderDusts, updateDusts } from '../dust';

export const ACTION_CORRECT = 1;
export const ACTION_INCORRECT = 2;
export const ACTION_FINISH = 3;

const CHARACTER_OFFSET_X = 300;
const CHARACTER_WIDTH = 100;
const CHARACTER_HEIGHT = 100;

const CHARACTERS_IN_LINE = 40;

const Dom = {
  ground: $('#g'),
  D: $('#d'), // distance
  tC: $('#d-t'), // textContainer
  text: $('#t'),
  subText: $('#st'),
  frame: $('#ef'),
  bar: $('.eb'),
  lP: $('#d-l')
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
      frameWidth: 32,
      frameHeight: 32,
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
        updateEnergyBar(player.E);
      }
    });

    // update initial energy
    updateEnergyBar(player.E);

    const state = {
      C: 0, // cursor
      line: {
        sCI: 0, // startCharIndex
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
        name: logs.isBot ? 'Bot' : i + 1,
        lP: Dom.lP // labelParent
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

    state.line = updateTextLines(state, words, state.C);
    state.C = updateCursor(state.line, state.C);

    const createDustAt = createDust(this);

    this.keyPressHandler = e => {
      e.preventDefault();

      const { line, C } = state;
      const { phrase, sCI } = line;
      const c = e.key;

      if (c === 'Enter') return;

      if (state.isFinished) return;

      const now = Date.now();
      const cursorChar = phrase.charAt(C - sCI);
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

        const newCursor = C + 1;

        state.C = updateCursor(line, newCursor);

        // if the cursor was at the end of the line
        if (state.C >= line.sCI + line.phrase.length) {
          state.line = updateTextLines(state, words, line.lastWordIndex + 1);
          state.C = updateCursor(state.line, state.C);
        }

        if (player.isInSkill()) {
          state.D += 1;
          createPlus1Effect($('.cursor'));
        } else {
          player.incE();
          updateEnergyBar(player.E);
          player.acc();
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

              if (state.D > first) {
                r.innerHTML = `New Record!<br />${state.D}m`;
              } else {
                r.innerHTML = `You ran<br />${state.D}m`;
              }

              showElement(r);

              log.d = state.d;

              player.finish(() => {
                log.l.push(now - state.lastTime);
                log.l.push(ACTION_FINISH);
                log.n = new Date(state.startTime).toLocaleDateString();
                log.d = state.D;

                saveLog(data.story.id)(log);
              });
            },
            player.isInSkill() ? SKILL_DURATION + 1000 : 1000
          );
        }
      } else {
        // reset energy when there's a typo
        player.rE();
        updateEnergyBar(player.E, true);
        showWarningAtCursor($('.cursor'), state);

        log.l.push(now - state.lastTime);
        log.l.push(ACTION_INCORRECT);
      }

      state.lastTime = now;
    };

    // character-typing handler
    $aEL(KEYPRESS, T.keyPressHandler);

    T.keyDownHandler = e => {
      switch (e.key) {
        case 'Escape':
          mountScene('title');
          break;
      }
    };

    $aEL(KEYDOWN, T.keyDownHandler);

    const context = T.O.context;

    // game loop
    T.loop = GameLoop({
      update: function() {
        // slow down the player each frame
        player.dec();

        player.update();

        if (state.isStarted) {
          ghosts.forEach(g => {
            g.dec();
            g.update();
          });
        }

        state.D = (player.x / 200).toFixed(2);
        updateDistance(state.D);

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

    $rEL(KEYPRESS, T.keyPressHandler);
    $rEL(KEYDOWN, T.keyDownHandler);

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
  Dom.D.innerHTML = d + 'm';
}

function getWords(text) {
  return text
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/\s+/g, ' ')
    .split(' ');
}

function updateTextLines(state, words, wordIndex) {
  const line = getNextLine(
    state.line.sCI + state.line.phrase.length - 1,
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
        sCI: lastCharIndex + 1,
        lastWordIndex: index
      };
    else {
      s = t;
      index = i;
    }
  }

  return {
    phrase: ltrim(s),
    sCI: lastCharIndex + 1,
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
  const { phrase, sCI } = line;
  const indexInPhrase = cursor - sCI;

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
    aC(clone, 'effect');

    $rAF(() => {
      aC(clone, 'dropped');
    });

    $sT(() => {
      parent.removeChild(clone);
    }, 1000);
  }
  const width = Dom.frame.offsetWidth - 2;
  const calculatedWidth = $ms(energy * (width / 100), width);

  Dom.bar.style.width = calculatedWidth + 'px';
}

function updateGround(x) {
  Dom.ground.style.backgroundPositionX = (-x % 960) + 'px';
}

function startGhosts(ghosts) {
  ghosts.forEach(g => {
    const logs = g.O.logs;
    const list = logs.l;
    let time = 0;

    for (let i = 0; i < list.length; i += 2) {
      const diff = list[i];
      const action = list[i + 1];

      time += diff;

      $sT(() => {
        switch (action) {
          case ACTION_CORRECT:
            g.incE();
            g.acc();
            break;

          case ACTION_INCORRECT:
            g.rE();
            break;
        }
      }, time);
    }

    g.showLabel();
  });
}

function showWarningAtCursor(cursorElement, state) {
  if (state.cT) {
    $cT(state.cT);
    rC(cursorElement, 'warn');
  }

  $rAF(() => {
    $rAF(() => {
      aC(cursorElement, 'warn');

      state.cT = $sT(() => {
        rC(cursorElement, 'warn');
      }, 500);
    });
  });
}

function createPlus1Effect(cursorElement) {
  const x = cursorElement.offsetLeft;

  const elem = $c('span');
  aC(elem, 'effect', 'points');
  elem.innerHTML = '+1';
  elem.style.left = x - 23 + 'px';
  Dom.tC.appendChild(elem);

  $sT(() => {
    Dom.tC.removeChild(elem);
  }, 1000);
}

export default GameScene;
