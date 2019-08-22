import Character from './Character';
import { load, init, Sprite, GameLoop, imageAssets, setImagePath, SpriteSheet } from 'kontra';

import data from './data';

import '../css/styles.css';

const CHARACTERS_IN_LINE = 40;

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
      }
    }
  });

  const mach = Sprite({
    x: 300,
    y: 300 - 64,
    animations: machSheet.animations
  });

  const player = new Character({
    image: mach,
    x: 0,
    dx: 2
  });

  const state = {
    cursor: 0,
    line: {
      lastCharIndex: -1
    }
  };

  const ground = document.getElementById('ground');


  const words = getWords(data[0].text);

  state.line = updateTextLines(state, words, state.cursor);
  state.cursor = updateCursor(state);

  window.addEventListener('keypress', e => {
    const c = e.key;

    state.cursor = updateCursor(state, c);
  });

  let loop = GameLoop({  // create the main game loop
    update: function () { // update the game state
      player.update();

      updateDistance(player.x);

      player.x += player.dx;
      ground.style.backgroundPositionX = -player.x + 'px';
    },
    render: function () { // render the game state
      player.render();
    }
  });

  loop.start();    // start the game
});

function updateDistance(x) {
  const d = document.getElementById('distance');
  d.innerHTML = x;
}

function getWords(text) {
  return text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ').split(' ');
}

function getNextLine(lastCharIndex, words, fromWordIndex) {
  let index = fromWordIndex;
  let s = '';

  for (let i = fromWordIndex; i < words.length; i++) {
    const t = (i === 0) ? words[i] : s + ' ' + words[i];

    if (t.length > CHARACTERS_IN_LINE)
      return {
        phrase: s + ' ',
        startCharIndex: lastCharIndex + 1,
        lastWordIndex: index
      };
    else {
      s = t;
      index = i;
    }
  }

  return {
    phrase: s,
    startCharIndex: lastCharIndex + 1,
    lastWordIndex: index
  };
}

function updateTextLines(state, words, index) {
  const line = getNextLine(state.line.lastCharIndex, words, index);
  updateLine(line.phrase);

  const subLine = getNextLine(-1, words, line.lastWordIndex + 1);
  updateSubLine(subLine.phrase);

  return line;
}

function updateLine(html) {
  const text = document.getElementById('text');
  text.innerHTML = html;
}

function updateSubLine(html) {
  const subText = document.getElementById('sub-text');
  subText.innerHTML = html;
}

function updateCursor(state, char) {
  const { line, cursor } = state;
  const { phrase, startCharIndex } = line;

  const cursorChar = phrase.charAt(cursor - startCharIndex);
  const newCursor = cursorChar === char ? cursor + 1 : cursor;

  if (newCursor >= startCharIndex + phrase.length) {
    console.log('change');
  }

  const indexInPhrase = newCursor - startCharIndex;

  const pre = phrase.slice(0, indexInPhrase);
  const post = phrase.slice(indexInPhrase + 1);
  const c = phrase.charAt(indexInPhrase);
  const r = `<span class="correct">` + pre + `</span><span class="cursor">` + c + `</span>` + post;

  updateLine(r);

  return newCursor;
}