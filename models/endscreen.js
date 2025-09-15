class EndScreen extends MovableObject {
    w = 0;
    h = 0;
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }

  newPosition(x, width, height) {
    this.x = x + 720 / 2 - width / 2;
    this.y = 480 / 2 - height / 2;

    this.height = height;
    this.width = width;
  }

  zoomIn(width, height) {

    let intervalId = setInterval(() => {
      if (this.w < width && this.h < height) {
        this.w++;
        this.h += height / width;
        this.newPosition(0, this.w, this.h);
      } else {
        clearInterval(intervalId);
      }
    }, 200);
  }
}
