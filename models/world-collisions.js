/** Collision and cleanup World methods. */

/**
 * Runs all collision checks for the current frame and updates the boss health bar and enemy lists.
 */
World.prototype.checkCollisions = function () {
  this.checkCollisionsBottleAndEnemies();
  this.checkCharacterVsEnemies();
  this.checkCharacterVsBoss();
  this.checkCharacterVsCoins();
  this.checkCharacterVsGroundBottles();
  this.checkBottleVsBoss();
  this.bossBar.setPercentage(this.level.boss[0].energy);
  this.cleanDeathEnemies();
  this.cleanGroundBottles();
};

/**
 * Tests the character against every enemy. Allows a stomp kill and applies damage on direct contact.
 */
World.prototype.checkCharacterVsEnemies = function () {
  this.level.enemies.forEach((enemy) => {
    this.character.killerJump(enemy);
    if (this.character.isColliding(enemy) && !this.level.boss[0].isDead()) {
      this.character.hit(0.45);
      this.healthBar.setPercentage(this.character.energy);
    }
  });
};

/**
 * Damages the character when it touches the boss (only while the boss is still alive).
 */
World.prototype.checkCharacterVsBoss = function () {
  if (this.character.isColliding(this.level.boss[0]) && !this.level.boss[0].isDead()) {
    this.character.hit(0.7);
    this.healthBar.setPercentage(this.character.energy);
  }
};

/**
 * Collects coins when the character overlaps them and refreshes the coins HUD bar.
 */
World.prototype.checkCharacterVsCoins = function () {
  this.level.lifeCoins.forEach((lifeCoins) => {
    if (this.character.isColliding(lifeCoins) && !this.character.isCharacterDead()) {
      this.character.takeLifeCoin(this.level.lifeCoins, this.level.lifeCoins.indexOf(lifeCoins));
      this.coinsBar.setPercentage(this.character.coinsNumber);
    }
  });
};

/**
 * Picks up ground bottles when the character walks over them and refreshes the bottle HUD bar.
 */
World.prototype.checkCharacterVsGroundBottles = function () {
  this.level.bottles.forEach((bottle) => {
    if (this.character.isColliding(bottle)) {
      this.character.takeBottle(this.level.bottles, this.level.bottles.indexOf(bottle), this.soundVolume);
      this.bottlesBar.setPercentage(this.character.bottlesNumber);
    }
  });
};

/**
 * Tests each thrown bottle against the boss and triggers a boss-hit event on first contact.
 */
World.prototype.checkBottleVsBoss = function () {
  this.level.throwableObjects.forEach((throwableBottle) => {
    if (this.level.boss[0].isColliding(throwableBottle) && !throwableBottle.isDamaged) {
      this.handleBossBottleHit(throwableBottle);
    }
  });
};

/**
 * Tests every thrown bottle against every enemy. Kills the enemy and schedules bottle removal
 * on the first hit, preventing multiple hits from the same bottle.
 */
World.prototype.checkCollisionsBottleAndEnemies = function () {
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
};

/**
 * Sets an enemy's energy to zero and records the death timestamp.
 * @param {MovableObject} enemy - The enemy to kill.
 * @param {number} timestamp - Current timestamp used as the death time.
 */
World.prototype.killEnemyByBottle = function (enemy, timestamp) {
  enemy.energy = 0;
  enemy.dethTime = timestamp;
  this.playSoundBottleHit();
};

/**
 * Plays the chick/bottle-hit sound at the current world sound volume.
 */
World.prototype.playSoundBottleHit = function () {
  if (this.soundChick) {
    this.soundChick.play();
    this.soundChick.volume = this.soundVolume;
  }
};

/**
 * Removes a throwable bottle from the level after a 2-second delay.
 * @param {ThrowableObject} throwableBottle - The bottle to schedule for removal.
 */
World.prototype.scheduleBottleRemoval = function (throwableBottle) {
  setTimeout(() => {
    const idx = this.level.throwableObjects.indexOf(throwableBottle);
    if (idx !== -1) this.level.throwableObjects.splice(idx, 1);
  }, 2000);
};

/**
 * Removes dead enemies whose death animation has finished (dead for more than 1 second)
 * and triggers the kill counters and respawn logic.
 */
World.prototype.cleanDeathEnemies = function () {
  const toRemove = this.level.enemies.filter(
    (e) => e.dethTime > 0 && e.dethTime < new Date().getTime() - 1000
  );

  toRemove.forEach((enemy) => {
    enemy.dethTime = 0;
    this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
    this.updateKillCounters(enemy);
    this.respawnEnemyReplacement(enemy);
  });
};

/**
 * Increments the chicken or chick kill counter and refreshes all enemy-count elements in the DOM.
 * Counters are frozen once the boss is dead.
 * @param {MovableObject} enemy - The enemy that was killed.
 */
World.prototype.updateKillCounters = function (enemy) {
  const boss = this.level && this.level.boss ? this.level.boss[0] : null;
  const scoreLocked = !!(boss && boss.isDead());

  if (enemy instanceof Chicken) {
    if (!scoreLocked) {
      this.killedChickens++;
    }
    document.getElementById("killedChickens").innerHTML = this.killedChickens;
  } else if (enemy instanceof Chick) {
    if (!scoreLocked) {
      this.killedChicks++;
    }
    document.getElementById("killedChicks").innerHTML = this.killedChicks;
  }

  document.getElementById("chickens").innerHTML = this.level.enemies.filter(
    (e) => e instanceof Chicken
  ).length;
  document.getElementById("chicks").innerHTML = this.level.enemies.filter(
    (e) => e instanceof Chick
  ).length;
};

/**
 * Spawns replacement Chickens when a Chicken enemy is removed from the level.
 * @param {MovableObject} enemy - The enemy that was removed.
 */
World.prototype.respawnEnemyReplacement = function (enemy) {
  if (enemy instanceof Chicken) {
    this.addNewChicken(2, enemy.x);
  }
};

/**
 * Adds a number of new Chicken enemies to the level at the given position.
 * @param {number} chickensNumber - How many chickens to add.
 * @param {number} position - The x-coordinate where the chickens spawn.
 */
World.prototype.addNewChicken = function (chickensNumber, position) {
  for (let i = 0; i < chickensNumber; i++) {
    this.level.enemies.push(new Chicken(position));
  }
};

/**
 * Removes thrown bottles that have fallen below the canvas without hitting anything.
 */
World.prototype.cleanGroundBottles = function () {
  for (let i = this.level.throwableObjects.length - 1; i >= 0; i--) {
    const bottle = this.level.throwableObjects[i];
    if (!bottle.isDamaged && bottle.y > this.canvas.height) {
      this.level.throwableObjects.splice(i, 1);
    }
  }
};
