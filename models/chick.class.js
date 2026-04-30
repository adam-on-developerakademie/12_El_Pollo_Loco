class Chick extends MovableObject {
  IMAGES_WALKING = [
    "./img/3-enemies-chicken/chicken-small/1-walk/1-w.png",
    "./img/3-enemies-chicken/chicken-small/1-walk/2-w.png",
    "./img/3-enemies-chicken/chicken-small/1-walk/3-w.png",
  ];

  IMAGE_DEAD = ["./img/3-enemies-chicken/chicken-small/2-dead/dead.png"];

  /**
   * Creates a small chick enemy near the given x position.
   * @param {number} x - Base horizontal spawn position.
   */
  constructor(x) {
    super().loadImage("./img/3-enemies-chicken/chicken-small/1-walk/2-w.png");
    this.actionDistance(0, 0, 0, 0);
    this.height = 30;
    this.width = 30;
    this.y = this.worldHight - this.height - 55;
    this.x = x + Math.random() * 100;
    this.speed = 10 + Math.random() * 30;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.intervalId = this.animate();
  }

  /**
   * Starts movement and the animation loop.
   * @returns {number} The animation interval ID.
   */
  animate() {
    this.startMovement();
    return this.startAnimationLoop();
  }

  /** Starts leftward movement if the chick is still alive. */
  startMovement() {
    if (this.energy !== 0) {
      this.moveLeft();
    }
  }

  /**
   * Starts the 60 ms animation interval that updates state and plays frames.
   * @returns {number} The interval ID.
   */
  startAnimationLoop() {
    let IntervalId = setInterval(() => {
      this.updateAnimationState();
      this.playAnimationFrame();
    }, 60);
    return IntervalId;
  }

  /** Adjusts the collision box depending on whether the chick is alive or dead. */
  updateAnimationState() {
    if (this.energy == 0) {
      this.actionDistance(50, 5, 5, 5);
    } else {
      this.actionDistance(0, 5, 5, 5);
    }
  }

  /** Plays the correct animation frame and clears the interval when the chick dies. */
  playAnimationFrame() {
    const images = this.energy == 0 ? this.IMAGE_DEAD : this.IMAGES_WALKING;
    this.playAnimation(images);
    if (this.energy == 0) {
      clearInterval(this.intervalId);
    }
  }
}
