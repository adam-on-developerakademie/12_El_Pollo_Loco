class EndScreen extends MovableObject {
    w = 0;
    h = 0;
  /**
   * Creates an EndScreen object placed off-screen initially.
   * @param {string} imagePath - Path to the end-screen image.
   * @param {number} x - Initial horizontal position.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }

  /**
   * Repositions and resizes the end screen to a centred location.
   * @param {number} x - Horizontal offset from centre.
   * @param {number} width - New display width in pixels.
   * @param {number} height - New display height in pixels.
   */
  newPosition(x, width, height) {
    this.x = x + 720 / 2 - width / 2;
    this.y = 480 / 2 - height / 2;

    this.height = height;
    this.width = width;
  }

  /**
   * Animates the end screen by incrementally growing it to the target size.
   * Calls onDone once the full size is reached.
   * @param {number} width - Target width in pixels.
   * @param {number} height - Target height in pixels.
   * @param {Function} onDone - Callback invoked when the animation completes.
   */
  zoomIn(width, height, onDone) {

    let intervalId = setInterval(() => {
      if (this.w < width && this.h < height) {
        this.w++;
        this.h += height / width;
        this.newPosition(0, this.w, this.h);
      } else {
        clearInterval(intervalId);
        if (onDone) onDone();
      }
    }, 2);
  }
}
