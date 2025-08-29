class Cloud extends MovableObject {
  constructor() {
    super().loadImage(
      Math.random() > 0.5
        ? "../img/5_background/layers/4_clouds/1.png"
        : "../img/5_background/layers/4_clouds/2.png"
    );

    this.y = -20 + Math.random() * 100;
    this.x = 0 + Math.random() * 500;
    this.width = this.width * 5;
    this.height = this.height * 1.5;
  }
}
