class Cloud extends MovableObject {
  y = -20 + Math.random() * 100;
  x = 0 + Math.random() * 500;
  random =  Math.random()
  constructor() {
    super().loadImage(
      this.random > 0.5
        ? "./img/5-background/layers/4-clouds/1.png"
        : "./img/5-background/layers/4-clouds/2.png"
    );

    this.width = this.width * 5;
    this.height = this.height * 1.5;
    this.animate();
  }
  animate() {
    setInterval(() => {
      this.width + this.x <= 0 ? (this.x = 720) : (this.x -= this.random / 30);
    }, 1);
  }

moveLeft() {
    setInterval(() => {
      this.width + this.x <= 0 ? (this.x = 720) : (this.x -= this.random / 30);
    }, 1);
  }

}
