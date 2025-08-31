class Character extends MovableObject {
  IMAGES_WALKING = [
    "./img/2-character-pepe/2-walk/w-21.png",
    "./img/2-character-pepe/2-walk/w-22.png",
    "./img/2-character-pepe/2-walk/w-23.png",
    "./img/2-character-pepe/2-walk/w-24.png",
    "./img/2-character-pepe/2-walk/w-25.png",
    "./img/2-character-pepe/2-walk/w-26.png",
    "./img/2-character-pepe/3-jump/j-31.png",
  ];
  IMAGES_JUMPING = [
    "./img/2-character-pepe/3-jump/j-31.png",
    "./img/2-character-pepe/3-jump/j-32.png",
    "./img/2-character-pepe/3-jump/j-33.png",
    "./img/2-character-pepe/3-jump/j-34.png",
    "./img/2-character-pepe/3-jump/j-35.png",
    "./img/2-character-pepe/3-jump/j-36.png",
    "./img/2-character-pepe/3-jump/j-37.png",
    // "./img/2-character-pepe/3-jump/j-38.png",
    // "./img/2-character-pepe/3-jump/j-39.png",
  ];

  world;
  y = 50; // -55 = ground
  speed = 10;

  constructor() {
    super().loadImage("./img/2-character-pepe/2-walk/w-21.png");
    this.applayGravity();
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
        this.x += this.speed;
        this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isAboveGround()) {
        let i = this.curentImage % this.IMAGES_JUMPING.length;
        let path = this.IMAGES_JUMPING[i];
        this.img = this.imageCache[path];
        this.curentImage++;
      } else {
        this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"]
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          let i = this.curentImage % this.IMAGES_WALKING.length;
          let path = this.IMAGES_WALKING[i];
          this.img = this.imageCache[path];
          this.curentImage++;
        }
      }
    }, 50);
  }

  jump() {
    console.log("jumping...");
  }
}
