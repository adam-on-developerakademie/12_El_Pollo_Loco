class ThrowableObject extends MovableObject {
  constructor(x, y) {
    super().loadImage("./img/6-salsa-bottle/salsa-bottle.png");
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 50;
    this.speed = 10;
    this.gravity = 2;
    this.throwing = false;
    this.throw();
  }

  throw() {
    let intervalId = setInterval(() => {
      this.y < 1000 ? (this.x += 3) : clearInterval(intervalId);
    }, 1);
    this.speedY = 20;
    this.applyGravity();
  }
}
