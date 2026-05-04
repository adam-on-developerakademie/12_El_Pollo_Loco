/** Main game controller. Owns the canvas, all game objects, collision logic, and rendering. */
class World {
  /** The player character instance. */
  character = new Character();
  /** The currently active level. */
  level = level1;
  /** Canvas 2D rendering context. */
  ctx;
  /** Reference to the HTML canvas element. */
  canvas;
  /** Timestamp when the game session started (unused, reserved for scoring). */
  startTime;
  /** Global keyboard state object shared with Character. */
  keyboard;
  /** Horizontal camera offset applied to all world-space objects. */
  camera_x = 0;

  // --- HUD status bars ---
  coinsBar   = new StatusBar("LIFE_COINS_BAR");
  healthBar  = new StatusBar("HEALTH_BAR");
  bottlesBar = new StatusBar("BOTTLES_BAR");
  bossBar    = new StatusBar("BOSS_BAR");

  // --- Shared audio ---
  soundChick = new Audio("./audio/chick.wav");
  soundHen   = new Audio("./audio/hen.wav");
  /** Master volume for all game sounds (0–1). */
  soundVolume = 0.1;
  /** True while background music is playing. */
  musicOn = false;
  /** Becomes true the first time the boss enters the visible area. */
  bossBarUnlocked = false;

  // --- Kill counters displayed in the HUD ---
  killedChicks   = 0;
  killedChickens = 0;

  /** False after gameOver() is called, stops the render loop. */
  isRunning = true;
  /** requestAnimationFrame handle, kept for cancellation on game over. */
  animationFrameId = null;

  /**
   * @param {HTMLCanvasElement} canvas - The game canvas element.
   * @param {number} soundVolume - Initial master volume (0–1).
   */
  constructor(canvas, soundVolume) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.soundVolume = soundVolume;
    this.setWorld();
    this.character.run();
    this.startIntervallIDs();
  }

  /** Gives the character a back-reference to this World instance. */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Returns the current level.
   * @returns {Level}
   */
  getLevel() {
    return this.level;
  }

  /**
   * Starts the collision interval (60 Hz) and kicks off the render loop via rAF.
   * Stores all IDs in level.intervalIds for clean shutdown.
   */
  startIntervallIDs() {
    this.isRunning = true;
    this.level.intervalIds["checkCollisions"] = setInterval(() => {
      this.checkCollisions();
    }, 1000 / 60);

    this.animationFrameId = requestAnimationFrame(() => {
      this.draw();
    });
  }

  /**
   * Registers an interval ID under a named group in level.intervalIds.
   * Creates the group array on first use.
   * @param {string} intervalName - Group key (e.g. "throwableObjects").
   * @param {number} intervalId - The ID returned by setInterval.
   */
  pushIntervallIDs(intervalName, intervalId) {
    if (!this.level.intervalIds[intervalName]) {
      this.level.intervalIds[intervalName] = [];
    }
    this.level.intervalIds[intervalName].push(intervalId);
  }
}
