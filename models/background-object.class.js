class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;
  /**
   * Creates a static background layer tile.
   * @param {string} imagePath - Path to the layer image.
   * @param {number} x - Horizontal position.
   * @param {number} y - Vertical position (unused; fixed to canvas bottom).
   */
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
