class MovableObject {
  x = 50;
  y = 50;
  hight = 50;
  width = 50;
  img;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    console.log("moving right...");
  }

  moveLeft() {
    console.log("moving left...");
  }
}
