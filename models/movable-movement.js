/** Movement and gravity methods for MovableObject. */

/**
 * Starts a continuous leftward movement loop for this object.
 */
MovableObject.prototype.moveLeft = function () {
  this.startMovementLoop(this.moveLeftInterval, -1);
};

/**
 * Starts a continuous rightward movement loop for this object.
 */
MovableObject.prototype.moveRight = function () {
  this.startMovementLoop(this.moveRightInterval, 1);
};

/**
 * Creates a delta-time based interval that moves the object each tick.
 * @param {number|null} intervalRef - Existing interval reference (unused, overwritten).
 * @param {number} direction - 1 for right, -1 for left.
 */
MovableObject.prototype.startMovementLoop = function (intervalRef, direction) {
  let last = performance.now();
  const intervalId = setInterval(() => {
    const now = performance.now();
    const dt = Math.min((now - last) / 1, 5);
    last = now;
    if (this.energy != 0) {
      this.applyMovement(direction, dt);
    } else {
      clearInterval(intervalId);
    }
  }, 1);

  if (direction === -1) {
    this.moveLeftInterval = intervalId;
  } else {
    this.moveRightInterval = intervalId;
  }
};

/**
 * Moves the object by its speed in the given direction, wrapping at world bounds.
 * @param {number} direction - 1 for right, -1 for left.
 * @param {number} dt - Delta-time multiplier.
 */
MovableObject.prototype.applyMovement = function (direction, dt) {
  const speed = (this.speed / 300) * dt;
  const newX = this.x + direction * speed;
  const worldBound = this.worldWidth * 5;
  if (direction === -1) {
    this.x = this.width + newX <= 0 ? worldBound : newX;
  } else {
    this.x = this.width + newX >= worldBound ? 0 : newX;
  }
};

/**
 * Starts the gravity interval that pulls this object downward each frame.
 */
MovableObject.prototype.applyGravity = function () {
  let last = performance.now();
  this.gravityIntervalId = setInterval(() => {
    const now = performance.now();
    const dt = Math.min((now - last) / (1000 / 25), 3);
    last = now;
    this.updateVerticalPosition(dt);
    this.clampToGround();
  }, 1000 / 25);
};

/**
 * Updates the vertical position using speedY and acceleration, scaled by dt.
 * @param {number} dt - Delta-time multiplier.
 */
MovableObject.prototype.updateVerticalPosition = function (dt) {
  if (this.isAboveGround() || this.speedY > 0) {
    if (!this.energy == 0) {
      this.y -= this.speedY * dt;
      this.speedY -= this.acceleration * dt;
    } else {
      this.y -= 10 * dt;
    }
  }
};

/**
 * Snaps the object to the ground level and resets vertical speed if it falls below ground.
 * ThrowableObjects are excluded from clamping.
 */
MovableObject.prototype.clampToGround = function () {
  if (!(this instanceof ThrowableObject)) {
    const groundY = this.worldHight - this.height - 55;
    if (this.y > groundY) {
      this.y = groundY;
      this.speedY = 0;
    }
  }
};

/**
 * Returns true when the object is currently above the ground level.
 * ThrowableObjects always return true so they can continue falling.
 * @returns {boolean}
 */
MovableObject.prototype.isAboveGround = function () {
  if (this instanceof ThrowableObject) {
    return true;
  }
  return this.y < this.worldHight - this.height - 55;
};
