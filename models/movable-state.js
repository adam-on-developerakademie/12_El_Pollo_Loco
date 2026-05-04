/** Combat, pickup and state methods for MovableObject. */

/**
 * Reduces the object's energy by the given amount, unless it is jumping upward.
 * @param {number} x - Damage amount.
 */
MovableObject.prototype.hit = function (x) {
  if (!(this.speedY < 0 && this.isAboveGround() == true)) {
    this.energy -= x;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }
};

/**
 * Picks up a bottle from the level array and plays the pickup sound.
 * @param {Bottle[]} bottles - The level's bottle array.
 * @param {number} index - Index of the collected bottle.
 * @param {number} soundVolume - Volume to play the pickup sound at.
 */
MovableObject.prototype.takeBottle = function (bottles, index, soundVolume) {
  if (this.bottlesNumber < 25) {
    this.bottlesNumber++;
    bottles.splice(index, 1);
    if (this.soundBottle) {
      this.soundBottle.play();
      this.soundBottle.volume = soundVolume;
    }
  } else {
    this.bottlesNumber = 25;
  }
};

/**
 * Picks up a coin from the level array, plays the coin sound, and adds 25 to the coin counter.
 * @param {LifeCoin[]} lifeCoins - The level's coin array.
 * @param {number} index - Index of the collected coin.
 */
MovableObject.prototype.takeLifeCoin = function (lifeCoins, index) {
  if (this.soundCoin) {
    this.soundCoin.play();
    this.soundCoin.volume = this.world.soundVolume;
  }
  this.coinsNumber += 25;
  lifeCoins.splice(index, 1);
};

/**
 * Removes a bottle from the given array by index (called after a bottle hit).
 * @param {ThrowableObject[]} bottles - Array of thrown bottles.
 * @param {number} index - Index of the bottle to remove.
 */
MovableObject.prototype.bottlesDamage = function (bottles, index) {
  bottles.splice(index, 1);
};

/**
 * Placeholder hook called when a bottle smashes against this object.
 * Can be overridden by subclasses to add smash effects.
 */
MovableObject.prototype.smashBottle = function () {};

/**
 * Returns true when the object was hit within the last 100 ms.
 * @returns {boolean}
 */
MovableObject.prototype.isHurt = function () {
  let timepassed = new Date().getTime() - this.lastHit;
  timepassed = timepassed / 1000;
  return timepassed < 0.1;
};

/**
 * Returns true when the object's energy has reached zero.
 * @returns {boolean}
 */
MovableObject.prototype.isDead = function () {
  return this.energy == 0;
};
