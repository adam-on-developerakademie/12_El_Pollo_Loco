/** Lifecycle and teardown World methods. */

/**
 * Stops the game loop and clears every interval/frame registered for the world and all its objects.
 */
World.prototype.clearAllIntervalIds = function () {
  this.isRunning = false;
  if (this.animationFrameId !== null) {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  this.clearObjectIntervals(this.character);

  if (this.level) {
    this.clearLevelIntervalIds();
    this.level.enemies.forEach((enemy) => this.clearObjectIntervals(enemy));
    this.level.boss.forEach((boss) => this.clearObjectIntervals(boss));
    this.level.throwableObjects.forEach((obj) => this.clearObjectIntervals(obj));
    this.level.bottles.forEach((obj) => this.clearObjectIntervals(obj));
    this.level.lifeCoins.forEach((obj) => this.clearObjectIntervals(obj));
    this.level.clouds.forEach((obj) => this.clearObjectIntervals(obj));
    this.level.endScreens.forEach((obj) => this.clearObjectIntervals(obj));
  }
};

/**
 * Clears all intervals stored in `level.intervalIds`, handling both arrays and single IDs.
 */
World.prototype.clearLevelIntervalIds = function () {
  if (!this.level || !this.level.intervalIds) {
    return;
  }

  Object.values(this.level.intervalIds).forEach((entry) => {
    if (Array.isArray(entry)) {
      entry.forEach((id) => {
        if (typeof id === "number") {
          clearInterval(id);
        }
      });
    } else if (typeof entry === "number") {
      clearInterval(entry);
    }
  });
};

/**
 * Clears all properties on an object whose name contains 'interval' and whose value is a number.
 * @param {object} obj - The game object whose intervals should be cleared.
 */
World.prototype.clearObjectIntervals = function (obj) {
  if (!obj) {
    return;
  }

  Object.keys(obj).forEach((key) => {
    if (/interval/i.test(key) && typeof obj[key] === "number") {
      clearInterval(obj[key]);
      obj[key] = null;
    }
  });
};

/**
 * Ends the current game session: stops music, clears all intervals, resets the UI and returns
 * the player to the start screen.
 */
World.prototype.gameOver = function () {
  stopGameMusic();
  this.clearAllIntervalIds();
  if (typeof resetKeyboardState === "function") {
    resetKeyboardState();
  }
  this.cleanupLevel();
  document.getElementById("canvas").classList.add("displayNone");
  document.getElementById("startScreen").classList.remove("displayNone");
  document.getElementById("header").classList.remove("displayNone");
  document.getElementById("mobileButtons").classList.remove("center");
  document.getElementById("footer").classList.remove("displayNone");
  document.getElementById("overlay").classList.add("displayNone");
};

/**
 * Releases all level references and resets the global world variable to free memory after a game.
 */
World.prototype.cleanupLevel = function () {
  this.character.world = null;
  this.level.enemies = [];
  this.level.throwableObjects = [];
  this.level.bottles = [];
  this.level.lifeCoins = [];
  this.level.clouds = [];
  this.level.intervalIds = {};
  this.level = null;
  world = null;
};
