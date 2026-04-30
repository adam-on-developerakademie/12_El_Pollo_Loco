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

  /**
   * Main render loop called via requestAnimationFrame.
   * Clears the canvas, draws all world-space layers with camera offset,
   * then draws fixed HUD elements without offset, and schedules the next frame.
   */
  draw() {
    if (!this.isRunning || !this.level) {
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawWorldObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.drawHUD();
    this.ctx.translate(this.camera_x, 0);
    this.ctx.translate(-this.camera_x, 0);
    let self = this;
    this.animationFrameId = requestAnimationFrame(() => {
      self.draw();
    });
  }

  drawWorldObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.boss);
    this.addObjectsToMap(this.level.lifeCoins);
    this.addObjectsToMap(this.level.throwableObjects);
    this.addToMap(this.character);
  }

  drawHUD() {
    this.addToMap(this.coinsBar);
    this.addToMap(this.healthBar);
    this.addToMap(this.bottlesBar);
    if (this.shouldShowBossBar()) {
      this.addToMap(this.bossBar);
    }
    this.addObjectsToMap(this.level.endScreens);
  }

  /**
   * Returns true when the boss health bar should be visible.
   * Unlocks permanently the first time the boss enters the screen,
   * and triggers the initial chick spawn at that moment.
   * @returns {boolean}
   */
  shouldShowBossBar() {
    if (this.bossBarUnlocked) {
      return true;
    }

    let boss = this.level.boss[0];
    if (!boss) {
      return false;
    }

    let bossScreenLeft  = boss.x + this.camera_x;
    let bossScreenRight = bossScreenLeft + boss.width;
    let bossIsVisible   = bossScreenRight > 0 && bossScreenLeft < this.canvas.width;

    if (bossIsVisible) {
      this.bossBarUnlocked = true;
      this.spawnInitialChicks(boss.x);
    }

    return bossIsVisible;
  }

  /**
   * Spawns the initial wave of 5 chicks when the boss first becomes visible.
   * @param {number} bossX - Horizontal position of the boss (spawn location).
   */
  spawnInitialChicks(bossX) {
    this.spawnChicks(5, bossX);
    this.updateChickCountHUD();
  }

  spawnChicks(count, spawnX) {
    for (let i = 0; i < count; i++) {
      this.level.enemies.push(new Chick(spawnX));
    }
  }

  updateChickCountHUD() {
    document.getElementById("chicks").innerHTML = this.level.enemies.filter(
      (e) => e instanceof Chick
    ).length;
  }

  /**
   * Runs all collision checks for one tick:
   * bottle-vs-enemy, character-vs-enemy, character-vs-boss,
   * character-vs-coins, character-vs-bottles, bottle-vs-boss,
   * then cleans up dead enemies and off-screen bottles.
   */
  checkCollisions() {
    this.checkCollisionsBottleAndEnemies();
    this.checkCharacterVsEnemies();
    this.checkCharacterVsBoss();
    this.checkCharacterVsCoins();
    this.checkCharacterVsGroundBottles();
    this.checkBottleVsBoss();
    this.bossBar.setPercentage(this.level.boss[0].energy);
    this.cleanDeathEnemies();
    this.cleanGroundBottles();
  }

  checkCharacterVsEnemies() {
    this.level.enemies.forEach((enemy) => {
      this.character.killerJump(enemy);
      if (this.character.isColliding(enemy) && !this.level.boss[0].isDead()) {
        this.character.hit(0.45);
        this.healthBar.setPercentage(this.character.energy);
      }
    });
  }

  checkCharacterVsBoss() {
    if (this.character.isColliding(this.level.boss[0]) && !this.level.boss[0].isDead()) {
      this.character.hit(0.7);
      this.healthBar.setPercentage(this.character.energy);
    }
  }

  checkCharacterVsCoins() {
    this.level.lifeCoins.forEach((lifeCoins) => {
      if (this.character.isColliding(lifeCoins) && !this.character.isCharacterDead()) {
        this.character.takeLifeCoin(this.level.lifeCoins, this.level.lifeCoins.indexOf(lifeCoins));
        this.coinsBar.setPercentage(this.character.coinsNumber);
      }
    });
  }

  checkCharacterVsGroundBottles() {
    this.level.bottles.forEach((bottle) => {
      if (this.character.isColliding(bottle)) {
        this.character.takeBottle(this.level.bottles, this.level.bottles.indexOf(bottle), this.soundVolume);
        this.bottlesBar.setPercentage(this.character.bottlesNumber);
      }
    });
  }

  checkBottleVsBoss() {
    this.level.throwableObjects.forEach((throwableBottle) => {
      if (this.level.boss[0].isColliding(throwableBottle) && !throwableBottle.isDamaged) {
        throwableBottle.isDamaged = true;
        this.soundHen ? this.soundHen.play() : null;
        this.soundHen ? (this.soundHen.volume = this.soundVolume) : null;
        this.level.boss[0].energy = Math.max(0, this.level.boss[0].energy - 15);
        this.bossBar.setPercentage(this.level.boss[0].energy);
        this.level.boss[0].waitForAttack = false;
        this.spawnChicksOnBossHit(throwableBottle.x);
        setTimeout(() => {
          this.level.boss[0].bottlesDamage(
            this.level.throwableObjects,
            this.level.throwableObjects.indexOf(throwableBottle)
          );
        }, 2000);
      }
    });
  }

  spawnChicksOnBossHit(spawnX) {
    this.spawnChicks(5, spawnX);
    this.updateChickCountHUD();
  }

  /**
   * Detects collisions between thrown bottles and normal enemies.
   * On hit: marks the bottle as damaged (stops further collisions),
   * kills the enemy immediately, and removes the bottle after 2 s.
   */
  checkCollisionsBottleAndEnemies() {
    const now = new Date().getTime();
    this.level.enemies.forEach((enemy) => {
      this.level.throwableObjects.forEach((throwableBottle) => {
        if (enemy.isColliding(throwableBottle) && !throwableBottle.isDamaged) {
          throwableBottle.isDamaged = true;
          this.killEnemyByBottle(enemy, now);
          this.scheduleBottleRemoval(throwableBottle);
        }
      });
    });
  }

  killEnemyByBottle(enemy, timestamp) {
    enemy.energy = 0;
    enemy.dethTime = timestamp;
    this.playSoundBottleHit();
  }

  playSoundBottleHit() {
    this.soundChick ? this.soundChick.play() : null;
    this.soundChick ? (this.soundChick.volume = this.soundVolume) : null;
  }

  scheduleBottleRemoval(throwableBottle) {
    setTimeout(() => {
      const idx = this.level.throwableObjects.indexOf(throwableBottle);
      if (idx !== -1) this.level.throwableObjects.splice(idx, 1);
    }, 2000);
  }

  /**
   * Calls addToMap for each object in an array.
   * @param {DrawableObject[]} objects - Array of objects to draw.
   */
  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  /**
   * Draws a single object, flipping the canvas context horizontally if needed.
   * @param {DrawableObject} mo - The object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrameBorder(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the canvas context so the object renders mirrored (facing left).
   * @param {DrawableObject} mo - The object being flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width + 2 * mo.x, 0);
    this.ctx.scale(-1, 1);
  }

  /** Restores the canvas context after a horizontal flip. */
  flipImageBack(mo) {
    this.ctx.restore();
  }

  /**
   * Removes enemies whose death animation has played for at least 1 second.
   * Uses a snapshot (filter) to avoid mutating the array during iteration.
   */
  cleanDeathEnemies() {
    const toRemove = this.level.enemies.filter(
      (e) => e.dethTime > 0 && e.dethTime < new Date().getTime() - 1000
    );
    toRemove.forEach((enemy) => {
      enemy.dethTime = 0;
      this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
      this.updateKillCounters(enemy);
      this.respawnEnemyReplacement(enemy);
    });
  }

  updateKillCounters(enemy) {
    if (enemy instanceof Chicken) {
      this.killedChickens++;
      document.getElementById("killedChickens").innerHTML = this.killedChickens;
    } else if (enemy instanceof Chick) {
      this.killedChicks++;
      document.getElementById("killedChicks").innerHTML = this.killedChicks;
    }
    document.getElementById("chickens").innerHTML =
      this.level.enemies.filter((e) => e instanceof Chicken).length;
    document.getElementById("chicks").innerHTML =
      this.level.enemies.filter((e) => e instanceof Chick).length;
  }

  respawnEnemyReplacement(enemy) {
    if (enemy instanceof Chicken) {
      this.addNewChicken(2, enemy.x);
    }
  }

  /**
   * Spawns a given number of new Chicken instances at a position.
   * Each is a fresh instance to prevent shared-reference bugs.
   * @param {number} chickensNumber - How many chickens to spawn.
   * @param {number} position - Horizontal spawn position (x coordinate).
   */
  addNewChicken(chickensNumber, position) {
    for (let i = 0; i < chickensNumber; i++) {
      this.level.enemies.push(new Chicken(position));
    }
  }

  /**
   * Removes thrown bottles that have fallen below the visible canvas area.
   * Iterates in reverse to safely splice while looping.
   */
  cleanGroundBottles() {
    for (let i = this.level.throwableObjects.length - 1; i >= 0; i--) {
      const bottle = this.level.throwableObjects[i];
      if (!bottle.isDamaged && bottle.y > this.canvas.height) {
        this.level.throwableObjects.splice(i, 1);
      }
    }
  }

  /**
   * Stops all game loops and the render loop.
   * Cancels the rAF handle and clears every tracked interval
   * on the character, enemies, boss, bottles, coins, clouds, and end screens.
   */
  clearAllIntervalIds() {
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
  }

  /**
   * Clears all intervals stored in level.intervalIds.
   * Handles both flat number entries and array entries.
   */
  clearLevelIntervalIds() {
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
  }

  /**
   * Clears all interval IDs stored directly on an object.
   * Detects interval properties by matching the key name against /interval/i.
   * @param {object} obj - The game object to clean up.
   */
  clearObjectIntervals(obj) {
    if (!obj) {
      return;
    }

    Object.keys(obj).forEach((key) => {
      if (/interval/i.test(key) && typeof obj[key] === "number") {
        clearInterval(obj[key]);
        obj[key] = null;
      }
    });
  }

  /**
   * Ends the current game session: stops music, cancels all loops,
   * cleans up the level, and returns the UI to the main menu.
   */
  gameOver() {
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
  }

  /**
   * Releases all level references to allow garbage collection.
   * Empties every object array and nulls out level and world globals.
   */
  cleanupLevel() {
    this.character.world = null;
    this.level.enemies          = [];
    this.level.throwableObjects = [];
    this.level.bottles          = [];
    this.level.lifeCoins        = [];
    this.level.clouds           = [];
    this.level.intervalIds      = {};
    this.level = null;
    world      = null;
  }
}
