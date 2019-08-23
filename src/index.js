import Character from './Character';
import {
  load,
  init,
  Sprite,
  GameLoop,
  imageAssets,
  setImagePath,
  SpriteSheet
} from 'kontra';

import data from './data';

import '../css/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const CHARACTERS_IN_LINE = 40;

  const Dom = {
    ground: document.getElementById('ground'),
    distance: document.getElementById('distance'),
    text: document.getElementById('text'),
    subText: document.getElementById('sub-text'),
    frame: document.getElementById('energy-frame'),
    bar: document.getElementById('energy-bar')
  };

  let { canvas } = init();

  setImagePath('images');

  load('mach.png').then(() => {
    const machSheet = SpriteSheet({
      image: imageAssets['mach'],
      frameWidth: 64,
      frameHeight: 64,
      animations: {
        run: {
          frames: '0..5',
          frameRate: 10
        },
        stand: {
          frames: 2,
          frameRate: 1
        },
        skill: {
          frames: '6..17',
          frameRate: 10
        }
      }
    });

    const mach = Sprite({
      x: 300,
      y: 270 - 64,
      animations: machSheet.animations
    });

    const player = new Character({
      image: mach,
      x: 0,
      maxDx: 15,
      onSkillEnd: () => {
        updateEnergyBar(player.energy);
      }
    });

    const state = {
      cursor: 0,
      line: {
        startCharIndex: 0,
        phrase: ''
      }
    };

    const words = getWords(data[0].text);

    state.line = updateTextLines(state, words, state.cursor);
    state.cursor = updateCursor(state.line, state.cursor);

    player.playAnimation('stand');

    // user-typing handler
    window.addEventListener('keypress', e => {
      e.preventDefault();

      const { line, cursor } = state;
      const { phrase, startCharIndex } = line;
      const c = e.key;

      const cursorChar = phrase.charAt(cursor - startCharIndex);
      const isCorrect = cursorChar === c;

      if (isCorrect) {
        const newCursor = cursor + 1;

        state.cursor = updateCursor(line, newCursor);

        if (state.cursor >= line.startCharIndex + line.phrase.length) {
          state.line = updateTextLines(state, words, line.lastWordIndex + 1);
          state.cursor = updateCursor(state.line, state.cursor);
        }

        player.increaseEnergy();

        player.accelerate();
      } else {
        player.resetEnergy();
      }

      updateEnergyBar(player.energy);
    });

    let loop = GameLoop({
      update: function() {
        player.decelerate();
        player.update();

        updateDistance(player.x);
        updateGround(player.x);
      },
      render: function() {
        player.render();
      }
    });

    loop.start();
  });

  function updateDistance(x) {
    Dom.distance.innerHTML = (x / 200).toFixed(2) + 'm';
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
    Dom.ground.style.backgroundPositionX = (-x % 980) + 'px';
  }
});
