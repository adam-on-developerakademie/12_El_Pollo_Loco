class MovableObject {
  worldHight = 480;
  worldWidth = 720;
  x = 100;
  y = 270;
  height = 200;
  width = 100;
  img;
  imageCache = {};
  curentImage = 0;
  animationBusy = 0;
  element;
  intervallID;
  random = Math.random();
  speed = 4;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrameBorder(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
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

  applayGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < this.worldHight - this.height - 55;
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
