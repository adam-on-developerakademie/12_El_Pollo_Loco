class Chick extends MovableObject {
  IMAGES_WALKING = [
    "./img/3-enemies-chicken/chicken-small/1-walk/1-w.png",
    "./img/3-enemies-chicken/chicken-small/1-walk/2-w.png",
    "./img/3-enemies-chicken/chicken-small/1-walk/3-w.png",
  ];

  constructor(x) {
    super().loadImage("./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png");
    this.actionDistance(15, 5, 5, 5);
    this.height = this.height / 4;
    this.width = this.width / 2;
    this.y = this.worldHight - this.height - 55;
    this.x = x + 1000 + Math.random() * 1000;
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
