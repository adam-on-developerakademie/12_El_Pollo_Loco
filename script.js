let SwitschOff = false;

/** Initialises the UI on page load: syncs sound volume display, applies audio, and loads stored highscores. */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("soundVolume").innerHTML = Math.round(soundVolume * 10);
  if (typeof applySoundVolume === "function") {
    applySoundVolume();
  }
  document.getElementById("highscoreBest").textContent = localStorage.getItem("highscoreBest") || 0;
  document.getElementById("highscoreLast").textContent = localStorage.getItem("highscoreLast") || 0;
});

/**
 * Shows or hides the on-screen action buttons (left, right, jump, throw)
 * based on the current SwitschOff flag.
 */
function updateGameplayButtonsVisibility() {
  const actionButtonIds = ["left", "right", "jump", "throw"];

  actionButtonIds.forEach((id) => {
    const button = document.getElementById(id);
    if (!button) {
      return;
    }

    if (SwitschOff) {
      button.classList.add("displayNone");
    } else {
      button.classList.remove("displayNone");
    }
  });
}

/**
 * Hides the main menu, shows the game canvas and controls,
 * requests fullscreen on mobile, and starts a new game session.
 */
function startButton() {
  document.body.classList.add("game-mode");
  document.getElementById("header").classList.add("displayNone");
  document.getElementById("gameOver").classList.add("displayNone");
  document.getElementById("startScreen").classList.add("displayNone");
  document.getElementById("footer").classList.add("displayNone");
  document.getElementById("canvas").classList.remove("displayNone");
  document.getElementById("overlay").classList.remove("displayNone");
  document.getElementById("mobileButtons").classList.remove("displayNone");

  const mobileMode = isMobileUserAgent();
  SwitschOff = !isTouchGameplayDevice();

  if (mobileMode) {
    openFullscreen();
  }

  updateGameplayButtonsVisibility();
  run();
}

/**
 * Returns true when the browser's user-agent string indicates a mobile device.
 * Used to trigger fullscreen mode and adjust throw speed.
 * @returns {boolean}
 */
function isMobileUserAgent() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Returns true when the device is likely touch-controlled.
 * Checks touch points, touch events, pointer coarseness, user-agent, and viewport size.
 * Used to decide whether on-screen control buttons should be shown.
 * @returns {boolean}
 */
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

window.addEventListener("orientationchange", applyRotateHintMode);
window.addEventListener("resize", applyRotateHintMode);

/**
 * Re-evaluates button visibility when the device is in portrait mode on a touch screen.
 * Bound to both the orientationchange and resize events.
 */
function applyRotateHintMode() {
  const isPortraitTouch = isTouchGameplayDevice() &&
    window.matchMedia("(orientation: portrait)").matches;
  if (isPortraitTouch) {
    SwitschOff = false;
    updateGameplayButtonsVisibility();
  }
}

/** Hides the fullscreen overlay element. */
function overlayOff() {
  document.getElementById("overlay").style.display = "none";
}

/** Shows the fullscreen overlay element. */
function overlayOn() {
  document.getElementById("overlay").style.display = "block";
}
let isFullscreen = false;

/**
 * Toggles between fullscreen and windowed mode.
 */
function fullscreen() {
  if (!isFullscreen) {
    openFullscreen();
  } else {
    closeFullscreen();
  }
}

/**
 * Requests fullscreen for the entire document, with vendor-prefix fallbacks.
 */
function openFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode, with vendor-prefix fallbacks.
 */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

/**
 * Toggles the expanded (fullsize) CSS class on the body and updates the
 * window-size button icon accordingly.
 */
function toggleWindowSize() {
  const expanded = document.body.classList.toggle("fullsize");
  const btn = document.getElementById("windowSizeBtn");
  if (btn) btn.src = expanded ? "./img/icons/compress.svg" : "./img/icons/expand.svg";
}

/**
 * Ends the running game session and returns to the main menu.
 */
function backToMenu() {
  if (world && typeof world.gameOver === "function") {
    world.clearAllIntervalIds();
    world.gameOver();
  }
}

/** Opens the info/controls modal. */
function infoButton() {
  document.getElementById("infoModal").classList.remove("displayNone");
}

/** Reads the latest highscore values from localStorage and opens the highscore modal. */
function highscoreButton() {
  document.getElementById("highscoreBest").textContent = localStorage.getItem("highscoreBest") || 0;
  document.getElementById("highscoreLast").textContent = localStorage.getItem("highscoreLast") || 0;
  document.getElementById("highscoreModal").classList.remove("displayNone");
}

/** Opens the credits modal. */
function creditsButton() {
  document.getElementById("creditsModal").classList.remove("displayNone");
}

/** Opens the imprint / legal modal. */
function impressumButton() {
  document.getElementById("impressumModal").classList.remove("displayNone");
}

/**
 * Closes the modal with the given element ID.
 * @param {string} id - The DOM id of the modal to close.
 */
function closeModal(id) {
  document.getElementById(id).classList.add("displayNone");
}

/**
 * Clears all highscore data from localStorage and resets the displayed values to 0.
 */
function resetHighscore() {
  localStorage.removeItem("highscoreBest");
  localStorage.removeItem("highscoreLast");
  document.getElementById("highscoreBest").textContent = 0;
  document.getElementById("highscoreLast").textContent = 0;
}

/**
 * Increases the sound volume by one step (0.1), saves it to localStorage,
 * updates the volume display, and applies it to all audio sources.
 */
function soundVolumeLouder() {
  soundVolume = Math.min(soundVolume + 0.1, 1);
  soundVolume = parseFloat(soundVolume.toFixed(1));
  localStorage.setItem("soundVolume", soundVolume);
  document.getElementById("soundVolume").innerHTML = Math.round(soundVolume * 10);
  if (typeof applySoundVolume === "function") {
    applySoundVolume();
  }
}

/**
 * Decreases the sound volume by one step (0.1), saves it to localStorage,
 * updates the volume display, and applies it to all audio sources.
 */
function soundVolumeQuieter() {
  soundVolume = Math.max(soundVolume - 0.1, 0);
  soundVolume = parseFloat(soundVolume.toFixed(1));
  localStorage.setItem("soundVolume", soundVolume);
  document.getElementById("soundVolume").innerHTML = Math.round(soundVolume * 10);
  if (typeof applySoundVolume === "function") {
    applySoundVolume();
  }
}
