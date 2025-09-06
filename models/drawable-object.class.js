class DrawableObject {
  worldHight = 480;
  worldWidth = 720;
  distanceTop = 0;
  distanceBottom = 0;
  distanceLeft = 0;
  distanceRight = 0;
  lastMoveTime = 0
  x = 100;
  y = 270;
  height = 200;
  width = 100;

  img;
  imageCache = {};
  curentImage = 0;

  drawFrameBorder(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Bottle || this instanceof Endboss || this instanceof ThrowableObject) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      //ctx.strokeStyle = "transparent";
      ctx.strokeStyle = "black";
      ctx.rect(
        this.x + this.distanceLeft,
        this.y + this.distanceTop,
        this.width - this.distanceRight - this.distanceLeft,
        this.height - this.distanceBottom - this.distanceTop
      );
      ctx.stroke();
    }
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  actionDistance(distanceTop,distanceBottom,distanceLeft,distanceRight){
    this.distanceTop = distanceTop;
    this.distanceBottom = distanceBottom;
    this.distanceLeft = distanceLeft;
    this.distanceRight = distanceRight;
  }


}
