class Chicken extends MovableObject {
  IMAGES_WALKING = [
    "./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png",
    "./img/3-enemies-chicken/chicken-normal/1-walk/2-w.png",
    "./img/3-enemies-chicken/chicken-normal/1-walk/3-w.png",
  ];

  IMAGE_DEAD = ["./img/3-enemies-chicken/chicken-normal/2-dead/dead.png"];

  /**
   * Creates a normal chicken enemy ahead of the given x position.
   * @param {number} x - Base horizontal spawn position.
   */
  constructor(x) {
    super().loadImage("./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png");
    
    this.height = this.height / 4;
    this.width = this.width / 2;
    this.y = this.worldHight - this.height - 55;
    this.x = x + 1000 + Math.random() * 1000;
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

  /** Starts leftward movement if the chicken is still alive. */
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
    let intervalId = setInterval(() => {
      this.updateAnimationState();
      this.playAnimationFrame();
    }, 60);
    return intervalId;
  }

  /** Adjusts the collision box depending on whether the chicken is alive or dead. */
  updateAnimationState() {
    if (this.energy == 0) {
      this.actionDistance(50, 5, 5, 5);
    } else {
      this.actionDistance(15, 5, 5, 5);
    }
  }

  /** Plays the correct animation frame and clears the interval when the chicken dies. */
  playAnimationFrame() {
    const images = this.energy == 0 ? this.IMAGE_DEAD : this.IMAGES_WALKING;
    this.playAnimation(images);
    if (this.energy == 0) {
      clearInterval(this.intervalId);
    }
  }



}


