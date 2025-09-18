let canvas;
let world;
let keyboard = new Keyboard();
let soundGame = new Audio("./audio/game.wav");
let soundMenu = new Audio("./audio/menu.mp3");
let soundVolume = 0.1;

function init() {
  playGameMusic()
  loadLevel()
  canvas = document.getElementById("canvas");
  world = new World(canvas, soundVolume);
  document.getElementById("chickens").innerHTML = world.level.enemies.filter(
    (e) => e instanceof Chicken
  ).length;
  document.getElementById("chicks").innerHTML = world.level.enemies.filter(
    (e) => e instanceof Chick
  ).length;

  console.log(`My character is:`, world);
}

window.addEventListener("keydown", (e) => {
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
  //console.log(`Button is listen:`,e, keyboard)
});

window.addEventListener("keyup", (e) => {
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
  //console.log(`Button is listen:`,e, keyboard);
});

function run() {
  init();
  world.clearAllIntervalIds();
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