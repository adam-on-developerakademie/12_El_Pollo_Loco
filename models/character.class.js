class Character extends MovableObject {

IMAGES_WALKING = [
    "./img/2-character-pepe/2-walk/w-21.png",
    "./img/2-character-pepe/2-walk/w-22.png",
    "./img/2-character-pepe/2-walk/w-23.png",
    "./img/2-character-pepe/2-walk/w-24.png",
    "./img/2-character-pepe/2-walk/w-25.png",
    "./img/2-character-pepe/2-walk/w-26.png",
  ];  
  world;

  constructor() {
    super().loadImage("./img/2-character-pepe/2-walk/w-21.png");
    this.y = this.worldHight - this.height -55;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
     
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT) {
      let i = this.curentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path];
      this.curentImage++;
    }}, 100);
  }

  jump() {
    console.log("jumping...");
  }
}
