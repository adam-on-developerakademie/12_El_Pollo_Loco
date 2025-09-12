class Cloud extends MovableObject {
  y = -20 + Math.random() * 100;
  x = -this.width + Math.random() * this.worldWidth;

  constructor(x) {
    super().loadImage(
      this.random > 0.5
        ? "./img/5-background/layers/4-clouds/1.png"
        : "./img/5-background/layers/4-clouds/2.png"
    );
    this.speed = 0.1 + Math.random() * 5;
    this.width = this.width * 5;
    this.height = this.height * 1.5;
    this.x =
      this.x < -this.width.x ? (this.x = this.worldWidth * 5) : x + this.x;
    this.animate();
  }
  animate() {
    this.moveLeft();
  }
}
