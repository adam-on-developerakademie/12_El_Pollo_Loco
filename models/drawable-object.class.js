/** Base class for all objects that can be drawn on the canvas. */
class DrawableObject {
  /** Canvas height in pixels. */
  worldHight = 480;
  /** Canvas width in pixels. */
  worldWidth = 720;
  /** Inset from the top edge used for collision detection. */
  distanceTop = 0;
  /** Inset from the bottom edge used for collision detection. */
  distanceBottom = 0;
  /** Inset from the left edge used for collision detection. */
  distanceLeft = 0;
  /** Inset from the right edge used for collision detection. */
  distanceRight = 0;
  /** Timestamp of the last movement, used for idle detection. */
  lastMoveTime = 0;
  /** Primary interval ID for the object's own animation loop. */
  intervalId;
  x = 200;
  y = 270;
  height = 200;
  width = 100;

  /** Currently displayed image element. */
  img;
  /** Cache of pre-loaded Image objects keyed by file path. */
  imageCache = {};
  /** Frame counter used to cycle through animation arrays. */
  curentImage = 0;

  /**
   * Draws a debug collision rectangle around the object.
   * Only rendered for game-relevant object types.
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
   */
  drawFrameBorder(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Chick || this instanceof Bottle || this instanceof Endboss || this instanceof ThrowableObject || this instanceof LifeCoin) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "transparent";
      ctx.rect(
        this.x + this.distanceLeft,
        this.y + this.distanceTop,
        this.width - this.distanceRight - this.distanceLeft,
        this.height - this.distanceBottom - this.distanceTop
      );
      ctx.stroke();
    }
  }

  /**
   * Loads a single image and assigns it to this.img.
   * @param {string} path - Relative path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image onto the canvas at the object''s position.
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Pre-loads an array of images into the imageCache for fast animation.
   * @param {string[]} arr - Array of image file paths to pre-load.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Sets the collision box insets for all four sides.
   * @param {number} distanceTop - Pixels to inset from the top.
   * @param {number} distanceBottom - Pixels to inset from the bottom.
   * @param {number} distanceLeft - Pixels to inset from the left.
   * @param {number} distanceRight - Pixels to inset from the right.
   */
  actionDistance(distanceTop, distanceBottom, distanceLeft, distanceRight) {
    this.distanceTop = distanceTop;
    this.distanceBottom = distanceBottom;
    this.distanceLeft = distanceLeft;
    this.distanceRight = distanceRight;
  }
}
