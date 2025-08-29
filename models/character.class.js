class Character extends MovableObject {
  constructor() {
    super().loadImage("./img/2-character-pepe/2-walk/w-21.png");
    this.y = 420 - this.height;
  }

  jump() {
    console.log("jumping...");
  }
}
