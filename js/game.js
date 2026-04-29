let canvas;
let world;
let keyboard = new Keyboard();
let soundGame = new Audio("./audio/game.wav");
let soundMenu = new Audio("./audio/menu.mp3");
let soundVolume = parseFloat(localStorage.getItem("soundVolume") ?? "1");

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

function applySoundVolume() {
  soundGame.volume = soundVolume;
  soundMenu.volume = soundVolume;

  if (!world) {
    return;
  }

  world.soundVolume = soundVolume;
  setAudioVolume(world);
  setAudioVolume(world.character);
  world.level.enemies.forEach((enemy) => setAudioVolume(enemy));
  world.level.throwableObjects.forEach((object) => setAudioVolume(object));
}

function init() {
  playGameMusic()
  loadLevel()
  canvas = document.getElementById("canvas");
  world = new World(canvas, soundVolume);
  applySoundVolume();
  document.getElementById("chickens").innerHTML = world.level.enemies.filter(
    (e) => e instanceof Chicken
  ).length;
  document.getElementById("chicks").innerHTML = world.level.enemies.filter(
    (e) => e instanceof Chick
  ).length;
}

function resetKeyboardState() {
  keyboard.SPACE = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
}

window.addEventListener("keydown", (e) => {
  if (!world || !world.isRunning) {
    return;
  }

  e.code == "Space" && keyboard.SPACE == false ? (keyboard.SPACE = true) : null;
  e.code == "ArrowUp" && keyboard.UP == false ? (keyboard.UP = true) : null;
  e.code == "ArrowDown" && keyboard.DOWN == false
    ? (keyboard.DOWN = true)
    : null;
  e.code == "ArrowLeft" && keyboard.LEFT == false
    ? (keyboard.LEFT = true)
    : null;
  e.code == "ArrowRight" && keyboard.RIGHT == false
    ? (keyboard.RIGHT = true)
    : null;
});

window.addEventListener("keyup", (e) => {
  if (!world || !world.isRunning) {
    return;
  }

  e.code == "Space" && keyboard.SPACE == true ? (keyboard.SPACE = false) : null;
  e.code == "ArrowUp" && keyboard.UP == true ? (keyboard.UP = false) : null;
  e.code == "ArrowDown" && keyboard.DOWN == true
    ? (keyboard.DOWN = false)
    : null;
  e.code == "ArrowLeft" && keyboard.LEFT == true
    ? (keyboard.LEFT = false)
    : null;
  e.code == "ArrowRight" && keyboard.RIGHT == true
    ? (keyboard.RIGHT = false)
    : null;
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