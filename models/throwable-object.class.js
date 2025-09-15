class ThrowableObject extends MovableObject {
  IMAGES_BOTTLE = ["./img/6-salsa-bottle/salsa-bottle.png"];
  IMAGES_BOTTLE_THROWN = [
    "./img/6-salsa-bottle/bottle-rotation/1-bottle-rotation.png",
    "./img/6-salsa-bottle/bottle-rotation/2-bottle-rotation.png",
    "./img/6-salsa-bottle/bottle-rotation/3-bottle-rotation.png",
    "./img/6-salsa-bottle/bottle-rotation/4-bottle-rotation.png",
  ];
  IMAGES_BOTTLE_SPLASH = [
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/1-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/2-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/3-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/4-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/5-bottle-splash.png",
    "./img/6-salsa-bottle/bottle-rotation/bottle-splash/6-bottle-splash.png",
  ];

  constructor(x, y, otherDirection, onMove) {
    super().loadImage(this.animatedImage(this.IMAGES_BOTTLE_THROWN, 60, 5,this.IMAGES_BOTTLE_SPLASH, 100, 1));
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_BOTTLE_THROWN);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.actionDistance(10, 5, 20, 20);
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 50;
    //this.speed =10;
    this.gravity = 2;
    this.throwing = false;
    this.intervalId = this.throw(otherDirection,onMove);
  }

  throw(otherDirection, onMove) {
    let intervalId = setInterval(() => {
      otherDirection ? (this.isDamaged ? this.x -= 1 : this.x -= 2 + onMove * 1.5) : (this.isDamaged ? this.x += 1 : this.x += 2 + onMove * 1.5);
    }, 1);
    this.y = 120 +  this.y--; 
    this.speedY = 20;
    this.applyGravity();
    return intervalId;
  }



}
