class Chicken extends MovableObject {
  IMAGES_WALKING = [
    "./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png",
    "./img/3-enemies-chicken/chicken-normal/1-walk/2-w.png",
    "./img/3-enemies-chicken/chicken-normal/1-walk/3-w.png",
  ];

  IMAGE_DEAD = ["./img/3-enemies-chicken/chicken-normal/2-dead/dead.png"];

  constructor(x) {
    super().loadImage("./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png");
    
    this.height = this.height / 4;
    this.width = this.width / 2;
    this.y = this.worldHight - this.height - 55;
    this.x = x + 1000 + Math.random() * 1000;
    this.speed = 10 + Math.random() * 30;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.animate();
  }

  animate() {
    if (this.energy !== 0) {
      this.moveLeft();
    }
    let intervalId = setInterval(() => {
      if (this.energy == 0) {
        this.actionDistance(50, 5, 5, 5);
        this.playAnimation(this.IMAGE_DEAD);
        clearInterval(intervalId);
      } else {
        this.actionDistance(15, 5, 5, 5);
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 60);
  }



}


