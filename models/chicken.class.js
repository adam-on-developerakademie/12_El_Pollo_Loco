class Chicken extends MovableObject {
  constructor() {
    super().loadImage("./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png");
    this.height = this.height / 3;
    this.width = this.width / 2;
    this.y = 420 - this.height;
    this.x = 400 + Math.random() * 200;
  }
}
