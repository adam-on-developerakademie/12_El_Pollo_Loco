let canvas;
let world;
let keyboard = new Keyboard();
let soundGame = new Audio("./audio/game.wav");
let soundMenu = new Audio("./audio/menu.mp3");
const _storedVolume = localStorage.getItem("soundVolume");
if (_storedVolume === null) localStorage.setItem("soundVolume", "1");
let soundVolume = _storedVolume !== null ? parseFloat(_storedVolume) : 1;

function setAudioVolume(target) {
  if (!target) {
    return;
  }

  Object.values(target).forEach((value) => {
    if (value instanceof HTMLAudioElement) {
      value.volume = soundVolume;
    }
  });
}

function applyWorldAudioVolume() {
  world.soundVolume = soundVolume;
  setAudioVolume(world);
  setAudioVolume(world.character);
  world.level.enemies.forEach((enemy) => setAudioVolume(enemy));
  world.level.throwableObjects.forEach((object) => setAudioVolume(object));
}

function applySoundVolume() {
  soundGame.volume = soundVolume;
  soundMenu.volume = soundVolume;
  if (world) applyWorldAudioVolume();
}

function updateEnemyHUD() {
  document.getElementById("chickens").innerHTML = world.level.enemies.filter(
    (e) => e instanceof Chicken
  ).length;
  document.getElementById("chicks").innerHTML = world.level.enemies.filter(
    (e) => e instanceof Chick
  ).length;
}

function init() {
  playGameMusic();
  loadLevel();
  canvas = document.getElementById("canvas");
  world = new World(canvas, soundVolume);
  applySoundVolume();
  updateEnemyHUD();
}

function resetKeyboardState() {
  keyboard.SPACE = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
}

function setKeyState(code, isDown) {
  if (code === "Space") keyboard.SPACE = isDown;
  else if (code === "ArrowUp") keyboard.UP = isDown;
  else if (code === "ArrowDown") keyboard.DOWN = isDown;
  else if (code === "ArrowLeft") keyboard.LEFT = isDown;
  else if (code === "ArrowRight") keyboard.RIGHT = isDown;
}

window.addEventListener("keydown", (e) => {
  if (!world || !world.isRunning) return;
  setKeyState(e.code, true);
});

window.addEventListener("keyup", (e) => {
  if (!world || !world.isRunning) return;
  setKeyState(e.code, false);
});

function run() {
  if (world) {
    world.clearAllIntervalIds();
  }
  resetKeyboardState();
  init();
}

function playMenuMusic() {
  if (soundMenu) {
    soundMenu = new Audio("./audio/menu.mp3");
    soundMenu.play();
    soundMenu.volume = soundVolume;
    soundMenu.loop = true;
  }
}

function playGameMusic() {
  soundMenu.pause();
  soundGame.play();
  soundGame.volume = soundVolume;
  soundGame.loop = true;
  soundGame.musicOn = true;
}

function toggleMute() {
  if (soundGame) {
    soundGame.muted = !soundGame.muted;
  }
}

function stopGameMusic() {
  if (soundGame) {
    soundGame.loop = false;
    soundGame.pause();
    soundGame.currentTime = 0; 
    soundGame.musicOn = false;
    soundMenu.play();
    soundMenu.volume = soundVolume;
    soundMenu.loop = true;
  }
}

function saveScore(score) {
  localStorage.setItem("highscoreLast", score);
  const best = parseInt(localStorage.getItem("highscoreBest") || 0);
  if (score > best) localStorage.setItem("highscoreBest", score);
}

function youLose() {
  const ch = world && world.character;
  if (!ch) return;
  if (ch.isCharacterDead() && !world.level.boss[0].isDead() && !ch.gameEnded) {
    ch.gameEnded = true;
    saveScore(world.killedChickens + world.killedChicks * 2);
    displayLoseAnimation();
  }
}

function youWon() {
  const ch = world && world.character;
  if (!ch) return;
  if (world.level.boss[0].isDead() && !ch.isCharacterDead() && !ch.gameEnded) {
    ch.gameEnded = true;
    saveScore(world.killedChickens + world.killedChicks * 2 + 10);
    displayWinAnimation();
  }
}

function displayLoseAnimation() {
  setTimeout(() => {
    world.level.endScreens[0].zoomIn(400, 200, () => {
      scheduleSecondLoseAnimation();
    });
  }, 2000);
}

function scheduleSecondLoseAnimation() {
  setTimeout(() => {
    world.level.endScreens[0].newPosition(-720, 0, 0);
    world.level.endScreens[1].zoomIn(300, 200, () => {});
  }, 500);
}

function displayWinAnimation() {
  setTimeout(() => {
    world.level.endScreens[2].zoomIn(600, 400, () => {
      scheduleSecondWinAnimation();
    });
  }, 2000);
}

function scheduleSecondWinAnimation() {
  setTimeout(() => {
    world.level.endScreens[2].newPosition(-720, 0, 0);
    world.level.endScreens[1].zoomIn(300, 200, () => {});
  }, 500);
}