class MovableObject extends DrawableObject {
  animationBusy = 0;
  action = false;
  playSound = false;
  jumpTime = 0;
  frameTime = 0;
  currentFrame = 0;
  element;
  random = Math.random();
  speed = 4;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;
  dethTime = 0;
  bottlesNumber = 0;
  coinsNumber = 0;
  isDamaged = false;

  isColliding(mo) {
    return (
      this.leftSideCollision(mo) &&
      this.topSideCollision(mo) &&
      this.rightSideCollision(mo) &&
      this.bottomSideCollision(mo)
    );
  }

  leftSideCollision(mo) {
    return (
      this.x +
        this.distanceLeft +
        this.width -
        this.distanceRight -
        this.distanceLeft >
      mo.x + mo.distanceLeft
    );
  }

  topSideCollision(mo) {
    return (
      this.y +
        this.distanceTop +
        this.height -
        this.distanceBottom -
        this.distanceTop >
      mo.y + mo.distanceTop
    );
  }

  rightSideCollision(mo) {
    return (
      this.x + this.distanceLeft <
      mo.x + mo.distanceLeft + mo.width - mo.distanceRight - mo.distanceLeft
    );
  }

  bottomSideCollision(mo) {
    return (
      this.y + this.distanceTop <
      mo.y + mo.distanceTop + mo.height - mo.distanceBottom - mo.distanceTop
    );
  }

  moveLeft() {
    this.moveLeftInterval = setInterval(() => {
      if (this.energy != 0) {
        this.width + this.x <= 0
          ? (this.x = this.worldWidth * 5)
          : (this.x -= this.speed / 100);
      } else {
        clearInterval(this.moveLeftInterval);
      }
    }, 1);
  }

  moveRight() {
    this.moveRightInterval = setInterval(() => {
      if (this.energy != 0) {
        this.width + this.x >= this.worldWidth * 5
          ? (this.x = 0)
          : (this.x += this.speed / 100);
      } else {
        clearInterval(this.moveRightInterval);
      }
    }, 1);
  }

  playAnimation(images) {
    let i = this.curentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.curentImage++;
  }

  animatedImage(IMAGES, animationSpeed, repeatAnimation, isDamagedIMAGES, isDamagedAnimationSpeed, isDamagedRepeatAnimation) {
    let condition = this.isDamaged;
    let n = IMAGES.length;
    let currentImage = IMAGES[0];
    for (let j = 0; j < repeatAnimation; j++) {
      let i = 0;
      setTimeout(() => {
        this.currentImage(IMAGES, animationSpeed, i, n, currentImage, condition, isDamagedIMAGES, isDamagedAnimationSpeed, isDamagedRepeatAnimation);
      }, (j * 1000) / IMAGES.length);
    }
    return currentImage;
  }

  currentImage(IMAGES, animationSpeed, i, n, currentImage, condition, isDamagedIMAGES, isDamagedAnimationSpeed, isDamagedRepeatAnimation) {
    let intervalId = setInterval(() => {
      if (i < n) {
        currentImage = this.loadImage(IMAGES[i]);
        if (condition != this.isDamaged) {
          clearInterval(intervalId), this.animatedImage(isDamagedIMAGES, isDamagedAnimationSpeed, isDamagedRepeatAnimation);
        }
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, animationSpeed);
    return i, currentImage;
  }

  playAnimationJump(images, duration, sound) {
    if (this.action == "jump") {
      if (this.playSound == false) {
        sound ? sound.play() : null;
        this.playSound = true;
      }
      console.log(this.speedY, this.acceleration, this.action);
      if (new Date().getTime() < this.jumpTime + 300) {
        this.img = this.imageCache[images[0]];
      } else if (new Date().getTime() < this.jumpTime + 500) {
        this.img = this.imageCache[images[1]];
      } else if (new Date().getTime() < this.jumpTime + 800) {
        this.img = this.imageCache[images[2]];
      } else if (new Date().getTime() < this.jumpTime + 900) {
        this.img = this.imageCache[images[3]];
      } else if (new Date().getTime() < this.jumpTime + 1000) {
        this.img = this.imageCache[images[4]];
      } else if (new Date().getTime() < this.jumpTime + 1100) {
        this.img = this.imageCache[images[5]];
        this.action = false;
        this.playSound = false;
      }
    }
  }

  playSequenceAnimation(images, duration, sound) {
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
        if (!this.energy == 0) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        } else {
          this.y -= 10;
        }
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

  hit(x) {
    if (!(this.speedY < 0 && this.isAboveGround() == true)) {
      this.energy -= x;
      if (this.energy <= 0) {
        this.energy = 0;
      } else {
        this.lastHit = new Date().getTime();
      }
    }
  }

  takeBottle(bottles, index) {
    if (this.bottlesNumber < 25) {
      this.bottlesNumber++;
      bottles.splice(index, 1);
    } else {
      this.bottlesNumber = 25;
    }
  }

  takeLifeCoin(lifeCoins, index) {
    this.coinsNumber += 25;
    lifeCoins.splice(index, 1);
  }

  bottlesDamage(bottles, index) {
    bottles.splice(index, 1);
  }

  smashBottle() {}

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.1;
  }

  isDead() {
    return this.energy == 0;
  }
}
