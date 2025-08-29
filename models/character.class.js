class Character extends MovableObject {
  constructor() {
    super().loadImage("../img/2_character_pepe/2_walk/W-21.png");
    this.y = 420 - this.height;
  }

  jump() {
    console.log("jumping...");
  }
}
