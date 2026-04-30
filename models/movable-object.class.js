/** Base class for all objects that move within the game world. Extends DrawableObject. */
class MovableObject extends DrawableObject {
  /** Prevents overlapping animation calls; 0 = free, >0 = busy. */
  animationBusy = 0;
  /** Current animation state, e.g. "jump", "dead", or false when idle. */
  action = false;
  /** Whether the current action sound has already been triggered this frame. */
  playSound = false;
  /** Timestamp of the last jump start, used to time jump animation frames. */
  jumpTime = 0;
  /** Timestamp controlling when the next sequence animation frame advances. */
  frameTime = 0;
  /** Current frame index within a sequence animation. */
  currentFrame = 0;
  /** DOM element reference (unused in most subclasses). */
  element;
  /** Random value (0–1) assigned at construction, used for spawn variation. */
  random = Math.random();
  /** Horizontal movement speed in units per dt tick. */
  speed = 4;
  /** True when the object faces left (mirrored rendering). */
  otherDirection = false;
  /** Vertical velocity; positive = upward, negative = falling. */
  speedY = 0;
  /** Gravity deceleration applied each physics tick. */
  acceleration = 2;
  /** Hit points; 0 = dead. */
  energy = 100;
  /** Timestamp set when the object dies, used to time death animation cleanup. */
  dethTime = 0;
  /** Number of salsa bottles the object is carrying. */
  bottlesNumber = 0;
  /** Number of coins the object is carrying. */
  coinsNumber = 0;
  /** True once the object has been hit by a thrown bottle. */
  isDamaged = false;
  /** Slow-motion accumulator for playAnimationSlower(); incremented each frame. */
  slowMotion = 0;

  /**
   * Returns true if this object overlaps with another using AABB collision.
   * @param {MovableObject} mo - The other object to test against.
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.leftSideCollision(mo) &&
      this.topSideCollision(mo) &&
      this.rightSideCollision(mo) &&
      this.bottomSideCollision(mo)
    );
  }

  /**
   * Checks that this object''s right edge is past the other''s left edge.
   * @param {MovableObject} mo
   * @returns {boolean}
   */
  leftSideCollision(mo) {
    return (
      this.x +
        this.distanceLeft +
        this.width -
        this.distanceRight -
        this.distanceLeft >
      mo.x + mo.distanceLeft
    );
  }

  /**
   * Checks that this object''s bottom edge is past the other''s top edge.
   * @param {MovableObject} mo
   * @returns {boolean}
   */
  topSideCollision(mo) {
    return (
      this.y +
        this.distanceTop +
        this.height -
        this.distanceBottom -
        this.distanceTop >
      mo.y + mo.distanceTop
    );
  }

  /**
   * Checks that this object''s left edge is before the other''s right edge.
   * @param {MovableObject} mo
   * @returns {boolean}
   */
  rightSideCollision(mo) {
    return (
      this.x + this.distanceLeft <
      mo.x + mo.distanceLeft + mo.width - mo.distanceRight - mo.distanceLeft
    );
  }

  /**
   * Checks that this object''s top edge is above the other''s bottom edge.
   * @param {MovableObject} mo
   * @returns {boolean}
   */
  bottomSideCollision(mo) {
    return (
      this.y + this.distanceTop <
      mo.y + mo.distanceTop + mo.height - mo.distanceBottom - mo.distanceTop
    );
  }

  /**
   * Starts a continuous leftward movement loop using delta time.
   * Wraps the object back to the far right when it leaves the left edge.
   * Stops automatically when energy reaches 0.
   */
  moveLeft() {
    this.startMovementLoop(this.moveLeftInterval, -1);
  }

  /**
   * Starts a continuous rightward movement loop using delta time.
   * Wraps the object back to the far left when it leaves the right edge.
   * Stops automatically when energy reaches 0.
   */
  moveRight() {
    this.startMovementLoop(this.moveRightInterval, 1);
  }

  startMovementLoop(intervalRef, direction) {
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
  }

  applyMovement(direction, dt) {
    const speed = (this.speed / 300) * dt;
    const newX = this.x + direction * speed;
    const worldBound = this.worldWidth * 5;
    if (direction === -1) {
      this.x = this.width + newX <= 0 ? worldBound : newX;
    } else {
      this.x = this.width + newX >= worldBound ? 0 : newX;
    }
  }

  /**
   * Plays one frame of a standard animation array and advances the frame counter.
   * Triggers the associated sound unless the object is already dead.
   * @param {string[]} images - Array of image paths for this animation.
   * @param {HTMLAudioElement} sound - Sound to play each frame.
   * @param {number} soundVolume - Volume level (0–1).
   */
  playAnimation(images, sound, soundVolume) {
    let i = this.curentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.curentImage++;
    if (this.alive && this.action != "dead") {
      sound ? (sound.play(), sound.volume = soundVolume) : null;
    } else if (this.alive && this.action == "dead") {
      sound ? (sound.play(), sound.volume = soundVolume) : null;
      this.alive = false;
    }
  }

  /**
   * Plays an animation at a reduced frame rate by accumulating a slowMotion counter.
   * A new frame is only shown once the counter reaches the "slower" threshold.
   * @param {string[]} images - Array of image paths for this animation.
   * @param {HTMLAudioElement} sound - Sound to play on each new frame.
   * @param {number} slower - Number of ticks between frame advances (e.g. 2.6).
   * @param {number} soundVolume - Volume level (0–1).
   */
  playAnimationSlower(images, sound, slower, soundVolume) {
    let i = this.curentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.slowMotion++;
    if (this.slowMotion >= slower) {
      sound ? (sound.play(), sound.volume = soundVolume) : null;
      this.slowMotion -= slower;
      this.curentImage++;
    }
  }

  /**
   * Starts a timed image sequence that can switch mid-way to a damage variant.
   * Used by ThrowableObject to transition from rotation to splash animation.
   * @param {string[]} IMAGES - Default animation frames.
   * @param {number} animationSpeed - Milliseconds per frame.
   * @param {number} repeatAnimation - How many times to repeat the sequence.
   * @param {string[]} isDamagedIMAGES - Frames played after isDamaged becomes true.
   * @param {number} isDamagedAnimationSpeed - Milliseconds per frame for damage variant.
   * @param {number} isDamagedRepeatAnimation - Repeat count for damage variant.
   * @returns {string} The first image path (used as the initial img src).
   */
  animatedImage(IMAGES, animationSpeed, repeatAnimation, isDamagedIMAGES, isDamagedAnimationSpeed, isDamagedRepeatAnimation) {
    let condition = this.isDamaged;
    let n = IMAGES.length;
    let currentImage = IMAGES[0];
    for (let j = 0; j < repeatAnimation; j++) {
      let i = 0;
      setTimeout(() => {
        this.currentImage(IMAGES, animationSpeed, i, n, currentImage, condition, isDamagedIMAGES, isDamagedAnimationSpeed, isDamagedRepeatAnimation);
      }, (j * 1000) / IMAGES.length);
    }
    return currentImage;
  }

  /**
   * Internal frame-ticker used by animatedImage.
   * Advances through an image array frame by frame; switches to damage variant
   * if isDamaged has changed since the sequence started.
   * @param {string[]} IMAGES - Current animation frames.
   * @param {number} animationSpeed - Milliseconds per frame.
   * @param {number} i - Current frame index.
   * @param {number} n - Total number of frames.
   * @param {string} currentImage - The currently displayed image path.
   * @param {boolean} condition - Snapshot of isDamaged at sequence start.
   * @param {string[]} isDamagedIMAGES - Damage animation frames.
   * @param {number} isDamagedAnimationSpeed - Damage frame speed.
   * @param {number} isDamagedRepeatAnimation - Damage repeat count.
   */
  currentImage(IMAGES, animationSpeed, i, n, currentImage, condition, isDamagedIMAGES, isDamagedAnimationSpeed, isDamagedRepeatAnimation) {
    let intervalId = setInterval(() => {
      if (i < n) {
        currentImage = this.loadImage(IMAGES[i]);
        if (condition != this.isDamaged) {
          clearInterval(intervalId);
          this.animatedImage(isDamagedIMAGES, isDamagedAnimationSpeed, isDamagedRepeatAnimation);
        }
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, animationSpeed);
    return i, currentImage;
  }

  /**
   * Shows time-gated jump animation frames based on elapsed time since jump start.
   * Resets action and playSound flags once the full jump sequence is complete.
   * @param {string[]} images - Jump animation frame paths.
   * @param {HTMLAudioElement} sound - Jump sound effect.
   * @param {number} soundVolume - Volume level (0–1).
   */
  playAnimationJump(images, sound, soundVolume) {
    if (this.action == "jump") {
      this.playJumpSoundOnce(sound, soundVolume);
      const frameIndex = this.getJumpFrameIndex();
      this.updateJumpFrame(images, frameIndex);
    }
  }

  playJumpSoundOnce(sound, soundVolume) {
    if (this.playSound == false) {
      sound ? (sound.play(), sound.volume = soundVolume) : null;
      this.playSound = true;
    }
  }

  getJumpFrameIndex() {
    const elapsed = new Date().getTime() - this.jumpTime;
    const timings = [300, 500, 800, 900, 1000, 1100];
    for (let i = 0; i < timings.length; i++) {
      if (elapsed < timings[i]) {
        return i;
      }
    }
    return -1;
  }

  updateJumpFrame(images, frameIndex) {
    if (frameIndex >= 0 && frameIndex < images.length) {
      this.img = this.imageCache[images[frameIndex]];
    }
    if (frameIndex >= 5) {
      this.action = false;
      this.playSound = false;
    }
  }

  /**
   * Plays a sequence animation over a fixed duration, advancing one frame at a time.
   * Falls back to the standing pose (j-31) if the frame array is exhausted.
   * @param {string[]} images - Animation frames to cycle through.
   * @param {number} duration - Total duration of one full cycle in seconds.
   * @param {HTMLAudioElement} sound - Sound to play (currently unused).
   */
  playSequenceAnimation(images, duration, sound) {
    let nowTime = new Date().getTime();
    if (this.jumpTime < nowTime) {
      this.jumpTime = nowTime + duration * 1000;
      this.currentFrame = 0;
    }
    if (this.jumpTime > nowTime) {
      if (this.frameTime < nowTime) {
        this.frameTime = nowTime + (duration / images.length) * 1000;
        if (images[this.currentFrame]) {
          this.img = this.imageCache[images[this.currentFrame]];
        } else {
          this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
        }
        this.currentFrame++;
      }
    }
  }

  // Placeholder — rightward movement for enemies is handled in moveRight() above.
  moveRight() {
  }

  /**
   * Starts a delta-time gravity loop at 25 Hz.
   * Applies vertical acceleration while the object is airborne or moving upward.
   * Clamps non-throwable objects to the ground level to prevent sinking.
   */
  applyGravity() {
    let last = performance.now();
    this.gravityIntervalId = setInterval(() => {
      const now = performance.now();
      const dt = Math.min((now - last) / (1000 / 25), 3);
      last = now;
      this.updateVerticalPosition(dt);
      this.clampToGround();
    }, 1000 / 25);
  }

  updateVerticalPosition(dt) {
    if (this.isAboveGround() || this.speedY > 0) {
      if (!this.energy == 0) {
        this.y -= this.speedY * dt;
        this.speedY -= this.acceleration * dt;
      } else {
        this.y -= 10 * dt;
      }
    }
  }

  clampToGround() {
    if (!(this instanceof ThrowableObject)) {
      const groundY = this.worldHight - this.height - 55;
      if (this.y > groundY) {
        this.y = groundY;
        this.speedY = 0;
      }
    }
  }

  /**
   * Returns whether this object is currently above the ground level.
   * ThrowableObjects always return true so gravity runs continuously.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.worldHight - this.height - 55;
    }
  }

  /**
   * Reduces energy by x, but only while the object is on the ground.
   * Records lastHit timestamp to enable the isHurt() cooldown window.
   * @param {number} x - Amount of damage to deal.
   */
  hit(x) {
    if (!(this.speedY < 0 && this.isAboveGround() == true)) {
      this.energy -= x;
      if (this.energy <= 0) {
        this.energy = 0;
      } else {
        this.lastHit = new Date().getTime();
      }
    }
  }

  /**
   * Picks up a salsa bottle from the level, capped at 25.
   * Plays the pickup sound and removes the bottle from the array.
   * @param {object[]} bottles - The level''s bottle array.
   * @param {number} index - Index of the picked-up bottle.
   * @param {number} soundVolume - Volume level (0–1).
   */
  takeBottle(bottles, index, soundVolume) {
    if (this.bottlesNumber < 25) {
      this.bottlesNumber++;
      bottles.splice(index, 1);
      this.soundBottle ? (this.soundBottle.play(), this.soundBottle.volume = soundVolume) : null;
    } else {
      this.bottlesNumber = 25;
    }
  }

  /**
   * Picks up a life coin and adds 25 coins to the counter.
   * Removes the coin from the level array and plays the coin sound.
   * @param {object[]} lifeCoins - The level''s coin array.
   * @param {number} index - Index of the collected coin.
   */
  takeLifeCoin(lifeCoins, index) {
    this.soundCoin ? (this.soundCoin.play(), this.soundCoin.volume = this.world.soundVolume) : null;
    this.coinsNumber += 25;
    lifeCoins.splice(index, 1);
  }

  /**
   * Removes a thrown bottle from the array after it has dealt damage.
   * @param {object[]} bottles - The throwable objects array.
   * @param {number} index - Index of the bottle to remove.
   */
  bottlesDamage(bottles, index) {
    bottles.splice(index, 1);
  }

  /** Placeholder for subclass-specific bottle-smash effects. */
  smashBottle() {}

  /**
   * Returns true if the object was hit within the last 100 ms.
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.1;
  }

  /**
   * Returns true if energy has reached 0.
   * @returns {boolean}
   */
  isDead() {
    return this.energy == 0;
  }
}
