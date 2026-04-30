class Bottle extends MovableObject {
  IMAGES_BOTTLE = [
    "./img/6-salsa-bottle/salsa-bottle.png",
    "./img/6-salsa-bottle/1-salsa-bottle-on-ground.png",
    "./img/6-salsa-bottle/2-salsa-bottle-on-ground.png",
    
  ];

 
  y = this.worldHeight - this.height - 55;
  

  /**
   * Creates a Bottle that spawns near the character's position and falls to the ground.
   * @param {number} characterPosition - The character's current x coordinate.
   */
  constructor(characterPosition) {
    super().loadImage(this.IMAGES_BOTTLE[this.setBottleImage()]);
    this.actionDistance(5, 5, 20, 20);
    this.height = this.height / 4;
    this.width =  this.width / 2;
    this.y = -85
    this.x = this.newBottlePlacement(characterPosition)
    this.speed = 10 + Math.random() * 20;
    this.applyGravity()
  }


  /**
   * Determines the visual variant and schedules a delayed image swap.
   * @returns {number} The chosen image index (0–2).
   */
  setBottleImage() {
    const index = this.determineBottleIndex();
    this.scheduleImageChange(index);
    return index;
  }

  /**
   * Picks a random image variant index based on a random roll.
   * @returns {number} 0, 1, or 2.
   */
  determineBottleIndex() {
    const random = Math.random();
    if (random > 0.66) return 0;
    if (random < 0.33) return 1;
    return 2;
  }

  /**
   * Schedules a delayed image change and position offset for the given variant.
   * @param {number} index - The image variant index (0–2).
   */
  scheduleImageChange(index) {
    const delay = 3000 + index * 10000;
    setTimeout(() => {
      this.applyBottleVariation(index);
      this.loadImage(this.IMAGES_BOTTLE[index]);
    }, delay);
  }

  /**
   * Applies a small horizontal offset to differentiate bottle variants.
   * @param {number} index - The image variant index (0–2).
   */
  applyBottleVariation(index) {
    if (index === 1) this.x -= 12;
    if (index === 2) this.x += 12;
  }

  /**
   * Calculates a random x position within the level bounds relative to the character.
   * @param {number} characterPosition - The character's current x coordinate.
   * @returns {number} A valid x position within level bounds.
   */
  newBottlePlacement(characterPosition) {
    let position = 200;
    do{ position= (characterPosition + (Math.random() - 0.5) * this.worldWidth * 2)
    }while (position < 200 || position > this.worldWidth * 4);
    return position;
  }





}
