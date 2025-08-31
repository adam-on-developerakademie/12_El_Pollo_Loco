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
  random = Math.random();
  speed = 4;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrameBorder(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "blue";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
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

  playAnimation(images, speed) {
    setInterval(() => {
      let i = 0;
      if (speed != 0) {
        i = this.curentImage % images.length;
      }
      let path = images[i];
      this.img = this.imageCache[path];
      this.curentImage++;
    }, speed);
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
}
