/** Runtime and gameplay flow methods for Character. */

/**
 * Adjusts the character movement speed when running on a mobile user-agent.
 */
Character.prototype.initializeSpeed = function () {
  if (typeof isMobileUserAgent === "function" && isMobileUserAgent()) {
    this.speed = 7.56;
  }
};

/**
 * Pre-loads all image arrays used by the character's animations into the image cache.
 */
Character.prototype.initializeImages = function () {
  this.loadImages(this.IMAGES_WALKING);
  this.loadImages(this.IMAGES_JUMPING);
  this.loadImages(this.IMAGES_DEAD);
  this.loadImages(this.IMAGES_HURT);
  this.loadImages(this.IMAGE_STAY);
  this.loadImages(this.IMAGE_LOST);
  this.loadImages(this.IMAGE_IDLE);
  this.loadImages(this.IMAGE_SLEEP);
};

/**
 * Starts the main character game loop at 60 fps.
 * Each tick handles movement, animations, bottle logic, camera and win/lose checks.
 */
Character.prototype.run = function () {
  this.buttonPressEvent();
  let last = performance.now();

  this.runIntervalId = setInterval(() => {
    const now = performance.now();
    const dt = Math.min((now - last) / (1000 / 60), 3);
    last = now;

    if (!this.world || !this.world.level) {
      return;
    }

    this.characterMove(dt);
    this.playAnimations(new Date().getTime() - this.lastMoveTime, this.world.soundVolume);
    this.spawnBottle();
    this.throwBottle();
    this.bottleReloaded();
    this.updateCamera();

    if (typeof youLose === "function") {
      youLose();
    }
    if (typeof youWon === "function") {
      youWon();
    }
  }, 1000 / 60);
};

/**
 * Calculates and clamps the horizontal camera offset so the character stays centred
 * and the view never scrolls outside the level bounds.
 */
Character.prototype.updateCamera = function () {
  const canvasWidth = 720;
  const levelWidth = this.world.level.levelEndX[0];
  this.world.camera_x = -this.x + 150;
  this.world.camera_x = Math.round(
    Math.min(0, Math.max(-(levelWidth - canvasWidth), this.world.camera_x))
  );
};

/**
 * Throws a bottle when the SPACE key is pressed and a bottle is available.
 * Creates the throwable object, registers it, plays the throw sound and decrements the counter.
 */
Character.prototype.throwBottle = function () {
  if (this.isReadyToThrow()) {
    this.isThrowing = true;
    const throwableBottle = this.createThrowableBottle();
    this.registerThrowableBottle(throwableBottle);
    this.playThrowSound();
    this.consumeBottle();
  }
};

/**
 * Instantiates a new ThrowableObject at the character's current position and direction.
 * @returns {ThrowableObject} The newly created bottle projectile.
 */
Character.prototype.createThrowableBottle = function () {
  const movement = this.world.keyboard.RIGHT || this.world.keyboard.LEFT ? 1 : 0;
  return new ThrowableObject(this.x, this.y, this.otherDirection, movement);
};

/**
 * Adds a throwable bottle to the level array and stores its interval ID for later cleanup.
 * @param {ThrowableObject} throwableBottle - The bottle to register.
 */
Character.prototype.registerThrowableBottle = function (throwableBottle) {
  this.world.level.throwableObjects.push(throwableBottle);
  this.world.pushIntervallIDs("throwableObjects", throwableBottle.intervalId);
};

/**
 * Plays the throw sound at the current world sound volume, if available.
 */
Character.prototype.playThrowSound = function () {
  if (this.soundThrow) {
    this.soundThrow.play();
    this.soundThrow.volume = this.world.soundVolume;
  }
};

/**
 * Decrements the character's bottle counter and refreshes the bottle status bar.
 */
Character.prototype.consumeBottle = function () {
  this.world.character.bottlesNumber--;
  this.world.bottlesBar.setPercentage(this.world.character.bottlesNumber);
};

/**
 * Returns true when the character has at least one bottle and the SPACE key is currently held
 * without a throw already in progress.
 * @returns {boolean}
 */
Character.prototype.isReadyToThrow = function () {
  if (this.world.character.bottlesNumber > 0) {
    if (this.world.keyboard.SPACE && !this.isThrowing) {
      return true;
    }
  }
  return false;
};

/**
 * Resets the throwing lock once the SPACE key is released, allowing the next throw.
 */
Character.prototype.bottleReloaded = function () {
  if (!this.world.keyboard.SPACE) {
    this.isThrowing = false;
  }
};

/**
 * Randomly spawns a new ground bottle near the character when fewer than 50 exist in the level.
 */
Character.prototype.spawnBottle = function () {
  if (Math.random() > 0.995 && this.world.level.bottles.length < 50) {
    const bottle = new Bottle(this.x);
    this.world.level.bottles.push(bottle);
  }
};

/**
 * Moves the character to the right when the RIGHT key is held, within level and boss bounds.
 * @param {number} dt - Delta-time multiplier for frame-rate-independent movement.
 */
Character.prototype.characterGoRight = function (dt) {
  if (
    this.world.keyboard.RIGHT &&
    this.x < this.world.level.boss[0].x + 50 &&
    this.x < this.world.level.levelEndX
  ) {
    this.lastMoveTime = new Date().getTime();
    this.x += this.speed * dt;
    this.otherDirection = false;
  }
};

/**
 * Moves the character to the left when the LEFT key is held, stopping at x = 150.
 * @param {number} dt - Delta-time multiplier for frame-rate-independent movement.
 */
Character.prototype.characterGoLeft = function (dt) {
  if (this.world.keyboard.LEFT && this.x > 150) {
    this.lastMoveTime = new Date().getTime();
    this.x -= this.speed * dt;
    this.otherDirection = true;
  }
};

/**
 * Initiates a jump when the UP key is pressed and the character is on the ground.
 * Sets speedY, marks the action as 'jump' and records the jump start time.
 */
Character.prototype.characterJump = function () {
  if (this.world.keyboard.UP && !this.isAboveGround()) {
    this.world.keyboard.UP = false;
    this.speedY = 20;

    if (new Date().getTime() > this.jumpTime + 800) {
      this.action = false;
      this.playSound = false;
    }

    if (this.action !== "jump") {
      this.action = "jump";
      this.jumpTime = new Date().getTime();
    }

    this.lastMoveTime = new Date().getTime();
  }
};

/**
 * Overrides MovableObject.hit to track whether damage was received while airborne.
 * Sets `hurtInAir` so the air-hurt animation can persist until landing.
 * @param {number} x - Damage amount.
 */
Character.prototype.hit = function (x) {
  const energyBeforeHit = this.energy;
  const lastHitBeforeHit = this.lastHit;
  MovableObject.prototype.hit.call(this, x);
  const tookDamage = this.energy < energyBeforeHit || this.lastHit !== lastHitBeforeHit;
  if (tookDamage && this.isAboveGround()) {
    this.hurtInAir = true;
  }
};

/**
 * Processes one movement tick: moves left/right, jumps, and resets the jump action on landing.
 * @param {number} dt - Delta-time multiplier for frame-rate-independent movement.
 */
Character.prototype.characterMove = function (dt) {
  this.characterGoLeft(dt);
  this.characterGoRight(dt);
  this.characterJump();

  if (!this.isAboveGround() && this.action == "jump" && this.speedY <= 0) {
    this.action = false;
    this.playSound = false;
    this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
  }
};

/**
 * Checks whether the character is jumping onto an enemy from above.
 * If so, kills the enemy instantly and plays the hit sound.
 * @param {MovableObject} mo - The enemy to check.
 * @returns {boolean} True when the enemy was stomped.
 */
Character.prototype.killerJump = function (mo) {
  const checkThis = this.isColliding(mo) && this.speedY < 0 && this.isAboveGround() == true;
  if (checkThis) {
    mo.energy = 0;
    mo.dethTime = new Date().getTime();
    if (this.soundChick) {
      this.soundChick.play();
      this.soundChick.volume = this.world.soundVolume;
    }
  }
  return checkThis;
};
