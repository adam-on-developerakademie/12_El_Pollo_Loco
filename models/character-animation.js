/** Animation and state methods for Character. */

/**
 * Chooses and plays the correct animation for the current character state
 * (dead, hurt, idle/sleeping, or ready to move).
 * @param {number} waitingTime - Milliseconds since the character last moved.
 */
Character.prototype.playAnimations = function (waitingTime) {
  if (this.isCharacterDead() && !this.world.level.boss[0].isDead()) {
    this.action = "dead";
    this.playAnimation(this.IMAGES_DEAD, this.soundDead, this.world.soundVolume);
  } else if (this.isHurt() || this.isAirHurtActive()) {
    if (this.isAboveGround()) {
      this.hurtInAir = true;
    }
    this.action = "hurt";
    this.lastMoveTime = new Date().getTime();
    this.playAnimation(this.IMAGES_HURT, this.soundHurt, this.world.soundVolume);
  } else if (waitingTime > 1000) {
    this.playWaitingAnimation(waitingTime);
  } else {
    this.playReadyAnimation();
  }
};

/**
 * Plays the idle or sleeping animation depending on how long the character has been still.
 * @param {number} waitingTime - Milliseconds since the last movement.
 */
Character.prototype.playWaitingAnimation = function (waitingTime) {
  if (waitingTime < 2500 && this.action != "jump") {
    this.playSequenceAnimation(this.IMAGE_IDLE, 2, this.world.soundVolume);
  } else if (waitingTime > 2500 && this.action != "jump") {
    this.playSequenceAnimation(this.IMAGE_SLEEP, 3, this.world.soundVolume);
  }
};

/**
 * Plays the animation that matches the character's active action:
 * jumping, walking, airborne, or standing still.
 */
Character.prototype.playReadyAnimation = function () {
  if (this.action == "jump") {
    this.playAnimationJump(this.IMAGES_JUMPING, this.soundJump, this.world.soundVolume);
  } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround()) {
    this.playAnimationSlower(this.IMAGES_WALKING, this.soundWalk, 2.6, this.world.soundVolume);
  } else if (this.isAboveGround()) {
    this.img = this.imageCache["./img/2-character-pepe/3-jump/j-39.png"];
  } else {
    this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
  }
};

/**
 * Returns true when the character was hurt while in the air and has not yet landed.
 * Resets `hurtInAir` automatically on landing.
 * @returns {boolean}
 */
Character.prototype.isAirHurtActive = function () {
  if (!this.hurtInAir) {
    return false;
  }
  if (!this.isAboveGround()) {
    this.hurtInAir = false;
    return false;
  }
  return true;
};

/**
 * Returns true when the character's energy is zero and has no remaining coins to revive with.
 * Handles the coin-based revival mechanic and triggers the death jump.
 * @returns {boolean}
 */
Character.prototype.isCharacterDead = function () {
  if (this.isDead()) {
    if (this.coinsNumber !== 0) {
      this.coinsNumber -= 25;
      this.world.coinsBar.setPercentage(this.coinsNumber);
      this.energy = 100;
      return false;
    }

    if (!this.world.level.boss[0].isDead()) {
      this.speedY = 20;
    }
    return true;
  }
};
