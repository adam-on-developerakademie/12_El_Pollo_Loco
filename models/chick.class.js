class Chick extends MovableObject {
  IMAGES_WALKING = [
    "./img/3-enemies-chicken/chicken-small/1-walk/1-w.png",
    "./img/3-enemies-chicken/chicken-small/1-walk/2-w.png",
    "./img/3-enemies-chicken/chicken-small/1-walk/3-w.png",
  ];

    IMAGE_DEAD = [
    "./img/3-enemies-chicken/chicken-normal/2-dead/dead.png",
  ];

  constructor(x) {
    super().loadImage("./img/3-enemies-chicken/chicken-small/1-walk/2-w.png");
    this.actionDistance(0, 0, 0, 0);
    this.height = 30;
    this.width = 30;
    this.y = this.worldHight - this.height - 55;
    this.x = x + Math.random() * 100;
    this.speed = 10 + Math.random() * 30;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    this.moveLeft();
    let chickenIntervalId = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 60);
  }
}
