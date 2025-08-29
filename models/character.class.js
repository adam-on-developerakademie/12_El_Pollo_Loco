class Character extends MovableObject {
  constructor() {
    super().loadImage("../assets/img/pepe/idle/idle01.png");
  }
  jump() {
    console.log("jumping...");
  }
}
