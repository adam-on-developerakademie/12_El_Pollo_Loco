/** Rendering and draw-related World methods. */

/**
 * Main render loop entry point. Clears the canvas, draws all world objects with camera offset,
 * renders the HUD without offset, and schedules the next frame via requestAnimationFrame.
 */
World.prototype.draw = function () {
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

  this.animationFrameId = requestAnimationFrame(() => {
    this.draw();
  });
};

/** Draws all world-space objects (camera offset applied). */
World.prototype.drawWorldObjects = function () {
  this.addObjectsToMap(this.level.backgroundObjects);
  this.addObjectsToMap(this.level.bottles);
  this.addObjectsToMap(this.level.clouds);
  this.addObjectsToMap(this.level.enemies);
  this.addObjectsToMap(this.level.boss);
  this.addObjectsToMap(this.level.lifeCoins);
  this.addObjectsToMap(this.level.throwableObjects);
  this.addToMap(this.character);
};

/** Draws fixed HUD elements (no camera offset). */
World.prototype.drawHUD = function () {
  this.addToMap(this.coinsBar);
  this.addToMap(this.healthBar);
  this.addToMap(this.bottlesBar);
  if (this.shouldShowBossBar()) {
    this.addToMap(this.bossBar);
  }
  this.addObjectsToMap(this.level.endScreens);
};

/** Returns true when the boss health bar should be visible. */
World.prototype.shouldShowBossBar = function () {
  if (this.bossBarUnlocked) {
    return true;
  }
  const isVisible = this.isBossVisible();
  if (isVisible && !this.bossBarUnlocked) {
    this.unlockBossBar();
  }
  return isVisible;
};

/** Returns true when any part of the boss sprite is within the viewport. */
World.prototype.isBossVisible = function () {
  const boss = this.level.boss[0];
  if (!boss) return false;
  const bossScreenLeft = boss.x + this.camera_x;
  const bossScreenRight = bossScreenLeft + boss.width;
  return bossScreenRight > 0 && bossScreenLeft < this.canvas.width;
};

/** Calls addToMap for each object in an array. */
World.prototype.addObjectsToMap = function (objects) {
  objects.forEach((obj) => {
    this.addToMap(obj);
  });
};

/** Draws one object, flipping the canvas context if needed. */
World.prototype.addToMap = function (mo) {
  if (mo.otherDirection) {
    this.flipImage(mo);
  }
  mo.draw(this.ctx);
  mo.drawFrameBorder(this.ctx);
  if (mo.otherDirection) {
    this.flipImageBack(mo);
  }
};

/** Flips the canvas context so the object renders mirrored. */
World.prototype.flipImage = function (mo) {
  this.ctx.save();
  this.ctx.translate(mo.width + 2 * mo.x, 0);
  this.ctx.scale(-1, 1);
};

/** Restores the canvas context after a horizontal flip. */
World.prototype.flipImageBack = function () {
  this.ctx.restore();
};
