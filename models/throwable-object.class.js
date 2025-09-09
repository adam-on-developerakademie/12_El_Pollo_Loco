class ThrowableObject extends MovableObject {
  constructor(x, y, otherDirection) {
    super().loadImage("./img/6-salsa-bottle/salsa-bottle.png");
     this.actionDistance(10, 5, 20, 20);
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 50;
    this.speed = 10;
    this.gravity = 2;
    this.throwing = false;
    this.intervallID=this.throw(otherDirection);
  }

  throw(otherDirection) {
    let intervalId = setInterval(() => {
     otherDirection?this.x-=5:this.x += 5
    }, 1);
    this.y=this.y+120;
    this.speedY = 20;
    this.applyGravity();
    return intervalId;
  }
}
