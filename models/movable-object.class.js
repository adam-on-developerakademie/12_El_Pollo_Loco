class MovableObject extends DrawableObject {
  animationBusy = 0;
  jumpTime = 0;
  frameTime = 0;
  currentFrame = 0;
  element;
  intervallID;
  random = Math.random();
  speed = 4;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;
  bottlesNumber = 0;
  coinsNumber = 0;

  isColliding(mo) {
    return (
      this.x + this.distanceLeft + this.width - this.distanceRight - this.distanceLeft > mo.x + mo.distanceLeft &&
      this.y + this.distanceTop + this.height - this.distanceBottom - this.distanceTop > mo.y + mo.distanceTop &&
      this.x + this.distanceLeft < mo.x + mo.distanceLeft  + mo.width -mo.distanceRight-mo.distanceLeft &&
      this.y + this.distanceTop < mo.y + mo.distanceTop  + mo.height - mo.distanceBottom - mo.distanceTop
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

  playSequenceAnimation(images, duration) {
    let nowTime = new Date().getTime();
    if (this.jumpTime < nowTime) {
      this.jumpTime = nowTime + duration * 1000;
      this.currentFrame = 0;
    }
    if (this.jumpTime > nowTime) {
      if (this.frameTime < nowTime) {
        this.frameTime = nowTime + (duration / images.length) * 1000;
        if (images[this.currentFrame]) {
          this.img = this.imageCache[images[this.currentFrame]];
        } else {
          this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
        }
        this.currentFrame++;
      }
    }
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

  takeBottle(bottles, index) {
    if (this.bottlesNumber < 25) {
      this.bottlesNumber++;
      console.log(bottles, index);
      bottles.splice(index, 1);
    } else {
      this.bottlesNumber = 25;
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
