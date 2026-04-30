class Chick extends MovableObject {
  IMAGES_WALKING = [
    "./img/3-enemies-chicken/chicken-small/1-walk/1-w.png",
    "./img/3-enemies-chicken/chicken-small/1-walk/2-w.png",
    "./img/3-enemies-chicken/chicken-small/1-walk/3-w.png",
  ];

  IMAGE_DEAD = ["./img/3-enemies-chicken/chicken-small/2-dead/dead.png"];

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

  animate() {
    this.startMovement();
    return this.startAnimationLoop();
  }

  startMovement() {
    if (this.energy !== 0) {
      this.moveLeft();
    }
  }

  startAnimationLoop() {
    let IntervalId = setInterval(() => {
      this.updateAnimationState();
      this.playAnimationFrame();
    }, 60);
    return IntervalId;
  }

  updateAnimationState() {
    if (this.energy == 0) {
      this.actionDistance(50, 5, 5, 5);
    } else {
      this.actionDistance(0, 5, 5, 5);
    }
  }

  playAnimationFrame() {
    const images = this.energy == 0 ? this.IMAGE_DEAD : this.IMAGES_WALKING;
    this.playAnimation(images);
    if (this.energy == 0) {
      clearInterval(this.intervalId);
    }
  }
}
