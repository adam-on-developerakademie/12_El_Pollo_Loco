class Character extends MovableObject {
  IMAGES_WALKING = [
    "./img/2-character-pepe/2-walk/w-21.png",
    "./img/2-character-pepe/2-walk/w-22.png",
    "./img/2-character-pepe/2-walk/w-23.png",
    "./img/2-character-pepe/2-walk/w-24.png",
    "./img/2-character-pepe/2-walk/w-25.png",
    "./img/2-character-pepe/2-walk/w-26.png",
    "./img/2-character-pepe/2-walk/w-21.png",
  ];
  IMAGES_JUMPING = [
    //"./img/2-character-pepe/3-jump/j-31.png",
    //"./img/2-character-pepe/3-jump/j-32.png",
    //"./img/2-character-pepe/3-jump/j-33.png",
    "./img/2-character-pepe/3-jump/j-34.png",
    "./img/2-character-pepe/3-jump/j-35.png",
    "./img/2-character-pepe/3-jump/j-36.png",
    "./img/2-character-pepe/3-jump/j-37.png",
    "./img/2-character-pepe/3-jump/j-38.png",
    "./img/2-character-pepe/3-jump/j-39.png",
    "./img/2-character-pepe/3-jump/j-31.png",
  ];
  IMAGES_DEAD = [
    "./img/2-character-pepe/5-dead/d-51.png",
    "./img/2-character-pepe/5-dead/d-52.png",
    "./img/2-character-pepe/5-dead/d-53.png",
    "./img/2-character-pepe/5-dead/d-54.png",
    "./img/2-character-pepe/5-dead/d-55.png",
    "./img/2-character-pepe/5-dead/d-56.png",
    "./img/2-character-pepe/5-dead/d-57.png",
  ];
  IMAGES_HURT = [
    "img/2-character-pepe/4-hurt/h-41.png",
    "img/2-character-pepe/4-hurt/h-42.png",
    "img/2-character-pepe/4-hurt/h-43.png",
  ];

  world;
  y = 50;
  speed = 3;

  constructor() {
    super().loadImage("./img/2-character-pepe/3-jump/j-31.png");
    this.applyGravity();
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.keyboardControl();
  }

  keyboardControl() {
    setInterval(() => {
      if (this.world.keyboard.SPACE) {
        this.throwBottle();
      }

      if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
        this.x += this.speed;
        this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      if (this.world.keyboard.UP && this.isAboveGround() == false) {
        this.speedY = 20;
      }
      this.world.camera_x = -this.x + 100;
    }, 1);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD, 0);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT, 0);
      } else if (this.isAboveGround()) {
        this.playFullAnimation(this.IMAGES_JUMPING, 1);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playFullAnimation(this.IMAGES_WALKING, 0.3);
      } else {
        this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
      }
    }, 1);
  }

   throwBottle(){
     let nowTime = new Date().getTime();
    if (this.animationBusy < nowTime) {
      this.animationBusy = nowTime +200;
        let bottle = new ThrowableObject(this.world.character.x, this.world.character.y);
        this.world.throwableObjects.push(bottle);
   }};


  jump() {
    console.log("jumping...");
  }
}
