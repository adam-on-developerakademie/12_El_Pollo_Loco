class Chicken extends MovableObject {
  constructor() {
    super().loadImage("../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.height = this.height / 3;
    this.width = this.width / 2;
    this.y = 420 - this.height;
    this.x = 400 + Math.random() * 200;
  }
}
