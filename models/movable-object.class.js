class MovableObject extends DrawableObject {
  animationBusy = 0;
  element;
  intervallID;
  random = Math.random();
  speed = 4;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;

  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  moveLeft() {
    setInterval(() => {
      this.width + this.x <= 0
        ? (this.x = this.worldWidth)
        : (this.x -= this.speed / 100);
    }, 1);
  }

  playAnimation(images) {
    let i = this.curentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.curentImage++;
  }

  playFullAnimation(images, duration) {
    let nowTime = new Date().getTime();
    if (this.animationBusy < nowTime) {
      this.animationBusy = nowTime + duration * 1000;
      images.forEach((element) => {
        setTimeout(() => {
          this.element = element;
          this.img = this.imageCache[this.element];
        }, ((1000 * duration) / images.length) * images.indexOf(element));
      });
    } else {
      this.intervallID = setInterval(() => {
        this.img = this.imageCache[this.element];
      }, 1);
    }
    clearInterval(this.intervallID);
  }

  moveRight() {
    console.log("moving right...");
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.worldHight - this.height - 55;
    }
  }
  hit() {
    this.energy -= 1;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  isDead() {
    return this.energy == 0;
  }
}
