/** Boss flow and boss-hit World methods. */

/**
 * Marks the boss bar as permanently visible and spawns the initial wave of chicks.
 */
World.prototype.unlockBossBar = function () {
  this.bossBarUnlocked = true;
  this.spawnInitialChicks(this.level.boss[0].x);
};

/** Spawns the initial wave when boss becomes visible. */
World.prototype.spawnInitialChicks = function (bossX) {
  this.spawnChicks(5, bossX);
  this.updateChickCountHUD();
};

/** Spawns a given number of chicks at the specified x position. */
World.prototype.spawnChicks = function (count, spawnX) {
  for (let i = 0; i < count; i++) {
    this.level.enemies.push(new Chick(spawnX));
  }
};

/** Refreshes the chick count in the HUD. */
World.prototype.updateChickCountHUD = function () {
  document.getElementById("chicks").innerHTML = this.level.enemies.filter(
    (e) => e instanceof Chick
  ).length;
};

/** Handles a confirmed bottle-hits-boss event. */
World.prototype.handleBossBottleHit = function (throwableBottle) {
  throwableBottle.isDamaged = true;
  this.playBossHitSound();
  this.damageBoss();
  this.spawnChicksOnBossHit(throwableBottle.x);
  this.scheduleBottleRemovalFromBoss(throwableBottle);
};

/** Plays the boss hit sound at current volume. */
World.prototype.playBossHitSound = function () {
  if (this.soundHen) {
    this.soundHen.play();
    this.soundHen.volume = this.soundVolume;
  }
};

/** Reduces boss energy and updates boss state. */
World.prototype.damageBoss = function () {
  this.level.boss[0].energy = Math.max(0, this.level.boss[0].energy - 15);
  this.bossBar.setPercentage(this.level.boss[0].energy);
  this.level.boss[0].waitForAttack = false;
};

/** Removes a bottle that hit the boss after 2 seconds. */
World.prototype.scheduleBottleRemovalFromBoss = function (throwableBottle) {
  setTimeout(() => {
    this.level.boss[0].bottlesDamage(
      this.level.throwableObjects,
      this.level.throwableObjects.indexOf(throwableBottle)
    );
  }, 2000);
};

/** Spawns 5 new chicks when the boss is hit. */
World.prototype.spawnChicksOnBossHit = function (spawnX) {
  this.spawnChicks(5, spawnX);
  this.updateChickCountHUD();
};
