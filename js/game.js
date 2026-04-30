let canvas;
let world;
let keyboard = new Keyboard();
let soundGame = new Audio("./audio/game.wav");
let soundMenu = new Audio("./audio/menu.mp3");
const _storedVolume = localStorage.getItem("soundVolume");
if (_storedVolume === null) localStorage.setItem("soundVolume", "1");
let soundVolume = _storedVolume !== null ? parseFloat(_storedVolume) : 1;

/**
 * Sets the volume of every HTMLAudioElement property found on the target object.
 * @param {object} target - Any object whose properties may be Audio instances.
 */
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

/**
 * Propagates the current soundVolume to the world, character, enemies, and throwable objects.
 */
function applyWorldAudioVolume() {
  world.soundVolume = soundVolume;
  setAudioVolume(world);
  setAudioVolume(world.character);
  world.level.enemies.forEach((enemy) => setAudioVolume(enemy));
  world.level.throwableObjects.forEach((object) => setAudioVolume(object));
}

/**
 * Applies the current soundVolume to the menu and game music tracks,
 * and to all in-world objects if a world instance exists.
 */
function applySoundVolume() {
  soundGame.volume = soundVolume;
  soundMenu.volume = soundVolume;
  if (world) applyWorldAudioVolume();
}

/**
 * Updates the live enemy count display in the HUD for chickens and chicks.
 */
function updateEnemyHUD() {
  document.getElementById("chickens").innerHTML = world.level.enemies.filter(
    (e) => e instanceof Chicken
  ).length;
  document.getElementById("chicks").innerHTML = world.level.enemies.filter(
    (e) => e instanceof Chick
  ).length;
}

/**
 * Initialises a fresh game session: starts music, loads the level,
 * creates the World instance, and syncs audio + HUD state.
 */
function init() {
  playGameMusic();
  loadLevel();
  canvas = document.getElementById("canvas");
  world = new World(canvas, soundVolume);
  applySoundVolume();
  updateEnemyHUD();
}

/**
 * Resets all keyboard key states to false.
 * Called before starting a new game to prevent stuck keys.
 */
function resetKeyboardState() {
  keyboard.SPACE = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
}

/**
 * Resets the displayed kill counters in the HUD to 0.
 * Called before each new game start (START and NEU).
 */
function resetKillCountersUI() {
  const killedChickensEl = document.getElementById("killedChickens");
  const killedChicksEl = document.getElementById("killedChicks");
  if (killedChickensEl) killedChickensEl.innerHTML = 0;
  if (killedChicksEl) killedChicksEl.innerHTML = 0;
}

/**
 * Maps a KeyboardEvent code to the corresponding keyboard state flag.
 * @param {string} code - KeyboardEvent.code value (e.g. "ArrowLeft").
 * @param {boolean} isDown - True for keydown, false for keyup.
 */
function setKeyState(code, isDown) {
  if (code === "Space") keyboard.SPACE = isDown;
  else if (code === "ArrowUp") keyboard.UP = isDown;
  else if (code === "ArrowDown") keyboard.DOWN = isDown;
  else if (code === "ArrowLeft") keyboard.LEFT = isDown;
  else if (code === "ArrowRight") keyboard.RIGHT = isDown;
}

/** Activates the keyboard key that matches the pressed key while the game is running. */
window.addEventListener("keydown", (e) => {
  if (!world || !world.isRunning) return;
  setKeyState(e.code, true);
});

/** Deactivates the keyboard key that matches the released key while the game is running. */
window.addEventListener("keyup", (e) => {
  if (!world || !world.isRunning) return;
  setKeyState(e.code, false);
});

/**
 * Stops any running game session and starts a new one from scratch.
 */
function run() {
  if (world) {
    world.clearAllIntervalIds();
  }
  resetKeyboardState();
  resetKillCountersUI();
  init();
}

/** Starts looping menu background music at the current sound volume. */
function playMenuMusic() {
  if (soundMenu) {
    soundMenu = new Audio("./audio/menu.mp3");
    soundMenu.play();
    soundMenu.volume = soundVolume;
    soundMenu.loop = true;
  }
}

/**
 * Stops the menu music and starts looping in-game background music.
 */
function playGameMusic() {
  soundMenu.pause();
  soundGame.play();
  soundGame.volume = soundVolume;
  soundGame.loop = true;
  soundGame.musicOn = true;
}

/** Toggles the muted state of the in-game background music. */
function toggleMute() {
  if (soundGame) {
    soundGame.muted = !soundGame.muted;
  }
}

/**
 * Stops the in-game music, resets its position, and resumes menu music.
 */
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

/**
 * Persists the score of the last game and updates the all-time best if beaten.
 * @param {number} score - The score achieved in the finished game session.
 */
function saveScore(score) {
  localStorage.setItem("highscoreLast", score);
  const best = parseInt(localStorage.getItem("highscoreBest") || 0);
  if (score > best) localStorage.setItem("highscoreBest", score);
}

/**
 * Checks the lose condition (character dead, boss alive) and triggers the lose animation once.
 */
function youLose() {
  const ch = world && world.character;
  if (!ch) return;
  if (ch.isCharacterDead() && !world.level.boss[0].isDead() && !ch.gameEnded) {
    ch.gameEnded = true;
    saveScore(world.killedChickens + world.killedChicks * 2);
    displayLoseAnimation();
  }
}

/**
 * Checks the win condition (boss dead, character alive) and triggers the win animation once.
 */
function youWon() {
  const ch = world && world.character;
  if (!ch) return;
  if (world.level.boss[0].isDead() && !ch.isCharacterDead() && !ch.gameEnded) {
    ch.gameEnded = true;
    saveScore(world.killedChickens + world.killedChicks * 2 + 10);
    displayWinAnimation();
  }
}

/**
 * Starts the lose end-screen zoom-in sequence after a 2-second delay.
 */
function displayLoseAnimation() {
  setTimeout(() => {
    world.level.endScreens[0].zoomIn(400, 200, () => {
      scheduleSecondLoseAnimation();
    });
  }, 2000);
}

/**
 * Slides the first lose screen out and zooms in the final score screen.
 */
function scheduleSecondLoseAnimation() {
  setTimeout(() => {
    world.level.endScreens[0].newPosition(-720, 0, 0);
    world.level.endScreens[1].zoomIn(300, 200, () => {});
  }, 500);
}

/**
 * Starts the win end-screen zoom-in sequence after a 2-second delay.
 */
function displayWinAnimation() {
  setTimeout(() => {
    world.level.endScreens[2].zoomIn(600, 400, () => {
      scheduleSecondWinAnimation();
    });
  }, 2000);
}

/**
 * Slides the win screen out and zooms in the final score screen.
 */
function scheduleSecondWinAnimation() {
  setTimeout(() => {
    world.level.endScreens[2].newPosition(-720, 0, 0);
    world.level.endScreens[1].zoomIn(300, 200, () => {});
  }, 500);
}