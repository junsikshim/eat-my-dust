import { Sprite, SpriteSheet, GameLoop, imageAssets } from '../kontra/kontra';
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
  $r,
  $ms,
  KEYPRESS,
  KEYDOWN,
  aC,
  rC,
  ltrim,
  WARN
} from '../utils';
import {
  clearClouds,
  initClouds,
  renderClouds,
  startClouds,
  updateClouds
} from '../cloud';
import { createDust, initDusts, renderDusts, updateDusts } from '../dust';

export var ACTION_CORRECT = 1;
export var ACTION_INCORRECT = 2;
export var ACTION_FINISH = 3;

var CHARACTER_OFFSET_X = 300;
var CHARACTER_WIDTH = 100;
var CHARACTER_HEIGHT = 100;

var CHARACTERS_IN_LINE = 40;

var Dom = {
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
    var T = this;

    showElement($('#d-t'));
    showElement($('#d-d'));
    showElement($('#d-e'));
    showElement($('#d-l'));
    showElement($('#d-pm'));
    showElement($('#d-gm'));

    // clean up labels
    $('#d-l').innerHTML = '';

    var masterSheet = SpriteSheet({
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

    var master = Sprite({
      x: CHARACTER_OFFSET_X,
      y: 270 - CHARACTER_HEIGHT,
      width: CHARACTER_WIDTH,
      height: CHARACTER_HEIGHT,
      animations: masterSheet.animations
    });

    var player = new Character({
      scene: T,
      image: master,
      x: 0,
      maxDx: 10,
      onSkillEnd: () => {
        updateEnergyBar(player.E);
      }
    });

    // update initial energy
    updateEnergyBar(player.E);

    var state = {
      C: 0, // cursor
      L: {
        // line
        sCI: 0, // startCharIndex
        P: '' // phrase
      },
      iS: false, // isStarted
      iF: false, // isFinished,
      lT: null, // lastTime
      sT: null // startTime
    };

    var ghostLogs = getLogs(data.story.id)(3);
    ghostLogs.sort((a, b) => b.d - a.d);

    var ghosts = ghostLogs.map((logs, i) => {
      var image = Sprite({
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
    var log = {
      d: 0,
      l: []
    };

    var words = getWords(data.story.text);

    state.L = updateTextLines(state, words, state.C);
    state.C = updateCursor(state.L, state.C);

    var createDustAt = createDust(this);

    this.keyPressHandler = e => {
      e.preventDefault();

      var { L, C } = state;
      var { P, sCI } = L;
      var c = e.key;

      if (c === 'Enter') return;

      if (state.iF) return;

      var now = Date.now();
      var cursorChar = P.charAt(C - sCI);
      var isCorrect = cursorChar === c;

      if (isCorrect) {
        // starts when the first character is correctly typed
        if (!state.iS) {
          state.iS = true;
          state.sT = now;
          state.lT = state.sT;

          startGhosts(ghosts);

          hideElement($('#d-pm'));
        }

        var newCursor = C + 1;

        state.C = updateCursor(L, newCursor);

        // if the cursor was at the end of the line
        if (state.C >= L.sCI + L.P.length) {
          state.L = updateTextLines(state, words, L.lWI + 1);
          state.C = updateCursor(state.L, state.C);
        }

        if (player.isInSkill()) {
          state.D += 1;
          createPlus1Effect($('.cursor'));
        } else {
          player.incE();
          updateEnergyBar(player.E);
          player.acc();
        }

        log.l.push(now - state.lT);
        log.l.push(ACTION_CORRECT);

        createDustAt(master.x, master.y);

        // end of the story
        if (!state.L.P) {
          state.iF = true;

          $sT(
            () => {
              var distances = ghostLogs.map(l => +l.d);
              distances.sort((a, b) => b - a);

              var first = distances[0];
              var r = $('#d-r');

              if (state.D > first) {
                r.innerHTML = `New Record!<br />${state.D}m`;
              } else {
                r.innerHTML = `You ran<br />${state.D}m`;
              }

              showElement(r);

              log.d = state.d;

              player.finish(() => {
                log.l.push(now - state.lT);
                log.l.push(ACTION_FINISH);
                log.n = new Date(state.sT).toLocaleDateString();
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

        log.l.push(now - state.lT);
        log.l.push(ACTION_INCORRECT);
      }

      state.lT = now;
    };

    // character-typing handler
    $aEL(KEYPRESS, T.keyPressHandler);

    T.keyDownHandler = e => e.key === 'Escape' && mountScene('title');

    $aEL(KEYDOWN, T.keyDownHandler);

    var context = T.O.context;

    // game loop (L - loop)
    T.L = GameLoop({
      update: function() {
        // slow down the player each frame
        player.dec();

        player.update();

        if (state.iS) {
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

    T.L.start();
  }

  unmount() {
    var T = this;

    if (T.L) {
      T.L.stop();
      T.L = null;
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

  showSkillEffect() {
    var elem = $('.wind');
    let parent = elem.parentNode;

    for (let i = 0; i < 15; i++) {
      (t => {
        $sT(() => {
          let el = elem.cloneNode();
          let x = $r() * 960;
          let y = $r() * 300 + 30;
          let opacity = $r() * 0.4 + 0.2;

          parent.appendChild(el);

          el.style.left = x + 'px';
          el.style.top = y + 'px';
          el.style.opacity = opacity;

          (e => {
            $sT(() => {
              aC(e, 'm');
            }, 100);

            $sT(() => {
              parent.removeChild(el);
            }, 1000);
          })(el);
        }, t * 200);
      })(i);
    }
  }
}

function updateDistance(d) {
  Dom.D.innerHTML = d + 'm';
}

var getWords = text =>
  text
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/\s+/g, ' ')
    .split(' ');

function updateTextLines(state, words, wordIndex) {
  var line = getNextLine(state.L.sCI + state.L.P.length - 1, words, wordIndex);
  updateLine(line.P);

  var subLine = getNextLine(-1, words, line.lWI + 1);
  updateSubLine(subLine.P);

  return line;
}

function getNextLine(lastCharIndex, words, fromWordIndex) {
  let index = fromWordIndex;
  let s = '';

  for (let i = fromWordIndex; i < words.length; i++) {
    var t = i === 0 ? words[i] : s + ' ' + words[i];

    if (t.length > CHARACTERS_IN_LINE)
      return {
        P: ltrim(s + ' '),
        sCI: lastCharIndex + 1,
        lWI: index // lastWordIndex
      };
    else {
      s = t;
      index = i;
    }
  }

  return {
    P: ltrim(s),
    sCI: lastCharIndex + 1,
    lWI: index // lastWordIndex
  };
}

var updateLine = html => (Dom.text.innerHTML = html);
var updateSubLine = html => (Dom.subText.innerHTML = html);

function updateCursor(line, cursor) {
  var { P, sCI } = line;
  var indexInPhrase = cursor - sCI;

  var pre = P.slice(0, indexInPhrase);
  var post = P.slice(indexInPhrase + 1);
  var c = P.charAt(indexInPhrase);
  var r =
    `<span class="correct">` +
    pre +
    `</span><span class="cursor">` +
    c +
    `</span>` +
    post;

  updateLine(r);

  return cursor;
}

function updateEnergyBar(energy, reset = false) {
  var bar = Dom.bar;

  if (reset) {
    var clone = bar.cloneNode();
    var parent = bar.parentNode;

    clone.removeAttribute('id');
    parent.appendChild(clone);
    aC(clone, 'e');

    $rAF(() => {
      aC(clone, 'd');
    });

    $sT(() => {
      parent.removeChild(clone);
    }, 1000);
  }
  var width = Dom.frame.offsetWidth - 2;
  var calculatedWidth = $ms(energy * (width / 100), width);

  bar.style.width = calculatedWidth + 'px';
}

function updateGround(x) {
  Dom.ground.style.backgroundPositionX = (-x % 960) + 'px';
}

function startGhosts(ghosts) {
  ghosts.forEach(g => {
    var logs = g.O.logs;
    var list = logs.l;
    let time = 0;

    for (let i = 0; i < list.length; i += 2) {
      var diff = list[i];
      var action = list[i + 1];

      time += diff;

      ((t, a) => {
        $sT(() => {
          switch (a) {
            case ACTION_CORRECT:
              g.incE();
              g.acc();
              break;

            case ACTION_INCORRECT:
              g.rE();
              break;
          }
        }, t);
      })(time, action);
    }

    g.showLabel();
  });
}

function showWarningAtCursor(cursorElement, state) {
  if (state.cT) {
    $cT(state.cT);
    rC(cursorElement, WARN);
  }

  $rAF(() => {
    $rAF(() => {
      aC(cursorElement, WARN);

      state.cT = $sT(() => {
        rC(cursorElement, WARN);
      }, 500);
    });
  });
}

function createPlus1Effect(cursorElement) {
  var x = cursorElement.offsetLeft;

  var elem = $c('span');
  aC(elem, 'e', 'p');
  elem.innerHTML = '+1';
  elem.style.left = x - 23 + 'px';

  Dom.tC.appendChild(elem);

  $sT(() => {
    Dom.tC.removeChild(elem);
  }, 1000);
}

export default GameScene;
