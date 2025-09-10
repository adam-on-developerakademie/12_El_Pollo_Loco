class LifeCoin extends MovableObject {
  IMAGES_LIFECOINS = ["./img/8-coin/coin-1.png", "./img/8-coin/coin-2.png"];

  y = this.worldHeight - this.height - 55;

  constructor(positionX) {
    super().loadImage(this.IMAGES_LIFECOINS[0]);
    this.actionDistance(55, 55, 55, 55);
    this.loadImages(this.IMAGES_LIFECOINS);
    this.height = 150;
    this.width = 150;
    this.y = 120;
    this.x = positionX;
    this.animate();
  }

  animate() {
    let endbossIntervalId = setInterval(() => {
      this.playAnimation(this.IMAGES_LIFECOINS);
    }, 300);
  }
}
