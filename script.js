function startButton(){
  document.body.classList.add("game-mode");
  document.getElementById("header").classList.add("displayNone");
  document.getElementById("gameOver").classList.add("displayNone");
  document.getElementById("startScreen").classList.add("displayNone");
  document.getElementById("footer").classList.add("displayNone");
  document.getElementById("canvas").classList.remove("displayNone");
  document.getElementById("overlay").classList.remove("displayNone");
  document.getElementById("mobileButtons").classList.remove("displayNone");

  if (isTouchGameplayDevice()) {
    openFullscreen();
  }

 run();
}

function isTouchGameplayDevice() {
  const hasTouchPoints = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
  const hasTouchEvent = "ontouchstart" in window;
  const coarsePointer = window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const userAgentTouch = /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent);
  const viewportWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const emulatedMobileViewport = viewportWidth <= 1024 && viewportHeight <= 1366;

  return hasTouchPoints || hasTouchEvent || coarsePointer || userAgentTouch || emulatedMobileViewport;
}

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
}

function overlayOn() {
  document.getElementById("overlay").style.display = "block";
}
let isFullscreen = false;

function fullscreen() {
  if (!isFullscreen) {
    openFullscreen();
  } else {
    closeFullscreen();
  }
}

function openFullscreen() {
  if (document.getElementById("canvas").requestFullscreen) {
    document.getElementById("canvas").requestFullscreen();
  } else if (document.getElementById("canvas").webkitRequestFullscreen) { /* Safari */
    document.getElementById("canvas").webkitRequestFullscreen();
  } else if (document.getElementById("canvas").msRequestFullscreen) { /* IE11 */
    document.getElementById("canvas").msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.getElementById("canvas").exitFullscreen) {
    document.getElementById("canvas").exitFullscreen();
  } else if (document.getElementById("canvas").webkitExitFullscreen) { /* Safari */
    document.getElementById("canvas").webkitExitFullscreen();
  } else if (document.getElementById("canvas").msExitFullscreen) { /* IE11 */
    document.getElementById("canvas").msExitFullscreen();
  }
}

function toggleWindowSize() {
  const expanded = document.body.classList.toggle("fullsize");
  const btn = document.getElementById("windowSizeBtn");
  if (btn) btn.textContent = expanded ? "\u229F" : "\u26F6";
}

function backToMenu() {
  if (world && typeof world.gameOver === "function") {
    world.clearAllIntervalIds();
    world.gameOver();
  }
}

function infoButton() {
  document.getElementById("infoModal").classList.remove("displayNone");
}

function highscoreButton() {
  document.getElementById("highscoreBest").textContent = localStorage.getItem("highscoreBest") || 0;
  document.getElementById("highscoreLast").textContent = localStorage.getItem("highscoreLast") || 0;
  document.getElementById("highscoreModal").classList.remove("displayNone");
}

function creditsButton() {
  document.getElementById("creditsModal").classList.remove("displayNone");
}

function closeModal(id) {
  document.getElementById(id).classList.add("displayNone");
}

function resetHighscore() {
  localStorage.removeItem("highscoreBest");
  localStorage.removeItem("highscoreLast");
  document.getElementById("highscoreBest").textContent = 0;
  document.getElementById("highscoreLast").textContent = 0;
}

function soundVolumeLouder() {
  soundVolume = Math.min(soundVolume + 0.1, 1);
  document.getElementById("soundVolume").innerHTML = Math.round(soundVolume * 10);
  if (typeof applySoundVolume === "function") {
    applySoundVolume();
  }
}

function soundVolumeQuieter() {
  soundVolume = Math.max(soundVolume - 0.1, 0);
  document.getElementById("soundVolume").innerHTML = Math.round(soundVolume * 10);
  if (typeof applySoundVolume === "function") {
    applySoundVolume();
  }
} 
