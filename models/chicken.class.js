class Chicken extends MovableObject {
  IMAGES_WALKING = [
    "./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png",
    "./img/3-enemies-chicken/chicken-normal/1-walk/2-w.png",
    "./img/3-enemies-chicken/chicken-normal/1-walk/3-w.png",
  ];

  constructor() {
    super().loadImage("./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png");
    this.actionDistance(5, 5, 5, 5);
    this.height = this.height / 4;
    this.width = this.width / 2;
    this.y = this.worldHight - this.height - 55;
    this.x = 400 + Math.random() * 1000;
    this.speed = 10 + Math.random() * 20;

    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    this.moveLeft();
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 60);
  }
}
