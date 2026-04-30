/** A salsa bottle thrown by the player. Moves horizontally and falls with gravity. */
class ThrowableObject extends MovableObject {
  IMAGES_BOTTLE_THROWN = [
    "./img/6-salsa-bottle/bottle-rotation/1-bottle-rotation.png",
    "./img/6-salsa-bottle/bottle-rotation/2-bottle-rotation.png",
    "./img/6-salsa-bottle/bottle-rotation/3-bottle-rotation.png",
    "./img/6-salsa-bottle/bottle-rotation/4-bottle-rotation.png",
  ];
  IMAGES_BOTTLE_SPLASH = [
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/1-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/2-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/3-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/4-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/5-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/6-bottle-splash.png",
  ];

  /**
   * @param {number} x - Horizontal spawn position (character''s x).
   * @param {number} y - Vertical spawn position (character''s y).
   * @param {boolean} otherDirection - True when thrown to the left.
   * @param {number} onMove - 1 if the character was moving when thrown, 0 otherwise.
   */
  constructor(x, y, otherDirection, onMove) {
    // Start the rotation-to-splash animation sequence immediately.
    super().loadImage(this.animatedImage(this.IMAGES_BOTTLE_THROWN, 60, 5, this.IMAGES_BOTTLE_SPLASH, 100, 1));
    this.loadImages(this.IMAGES_BOTTLE_THROWN);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.actionDistance(10, 5, 20, 20);
    this.x = x;
    this.y = y;
    this.width  = 70;
    this.height = 50;
    this.gravity = 2;
    this.throwing = false;
    const speedFactor = (typeof isMobileUserAgent === "function" && isMobileUserAgent()) ? 1.6 : 1;
    // Store the interval ID so it can be cancelled on game over or on hit.
    this.intervalId = this.throw(otherDirection, onMove, speedFactor);
  }

  /**
   * Starts the horizontal movement loop using delta time.
   * Speed scales with the character''s movement state (onMove).
   * Stops itself immediately when isDamaged becomes true (on hit).
   * Also starts gravity via applyGravity().
   * @param {boolean} otherDirection - True if the bottle travels left.
   * @param {number} onMove - Extra speed multiplier when character was moving.
   * @returns {number} The setInterval ID stored as this.intervalId.
   */
  throw(otherDirection, onMove, speedFactor = 1) {
    this.initializeThrowState();
    this.startHorizontalMovement(otherDirection, onMove, speedFactor);
    this.applyGravity();
    return this.intervalId;
  }

  /** Sets the initial vertical position and upward velocity before launch. */
  initializeThrowState() {
    this.y = 120 + this.y--;
    this.speedY = 20;
  }

  /**
   * Starts the delta-time horizontal movement interval.
   * Stops automatically when the bottle is marked as damaged.
   * @param {boolean} otherDirection - True if the bottle travels left.
   * @param {number} onMove - 1 if the character was moving when thrown.
   * @param {number} speedFactor - Additional speed multiplier (1.6 on mobile).
   */
  startHorizontalMovement(otherDirection, onMove, speedFactor) {
    let last = performance.now();
    this.intervalId = setInterval(() => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1, 5);
      last = now;
      if (this.isDamaged) {
        clearInterval(this.intervalId);
        clearInterval(this.gravityIntervalId);
        return;
      }
      this.moveBottleHorizontally(otherDirection, onMove, speedFactor, dt);
    }, 1);
  }

  /**
   * Moves the bottle one step in the correct horizontal direction.
   * @param {boolean} otherDirection - True if the bottle travels left.
   * @param {number} onMove - 1 if the character was moving when thrown.
   * @param {number} speedFactor - Additional speed multiplier.
   * @param {number} dt - Delta-time factor for frame-rate independence.
   */
  moveBottleHorizontally(otherDirection, onMove, speedFactor, dt) {
    const baseSpeed = (2 + onMove * 1.5) / 500;
    const adjustedSpeed = baseSpeed * dt * 100 * speedFactor;
    if (otherDirection) {
      this.x -= adjustedSpeed;
    } else {
      this.x += adjustedSpeed;
    }
  }

  /**
   * Overrides MovableObject.isAboveGround so the bottle always falls freely.
   * The ground-clamp in applyGravity is skipped for ThrowableObjects,
   * allowing the bottle to fly below the canvas before being cleaned up.
   * @returns {boolean} Always true.
   */
  isAboveGround() {
    return true;
  }
}
