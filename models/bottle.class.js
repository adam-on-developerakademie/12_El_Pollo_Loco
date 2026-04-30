class Bottle extends MovableObject {
  IMAGES_BOTTLE = [
    "./img/6-salsa-bottle/salsa-bottle.png",
    "./img/6-salsa-bottle/1-salsa-bottle-on-ground.png",
    "./img/6-salsa-bottle/2-salsa-bottle-on-ground.png",
    
  ];

 
  y = this.worldHeight - this.height - 55;
  

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


  setBottleImage() {
    const index = this.determineBottleIndex();
    this.scheduleImageChange(index);
    return index;
  }

  determineBottleIndex() {
    const random = Math.random();
    if (random > 0.66) return 0;
    if (random < 0.33) return 1;
    return 2;
  }

  scheduleImageChange(index) {
    const delay = 3000 + index * 10000;
    setTimeout(() => {
      this.applyBottleVariation(index);
      this.loadImage(this.IMAGES_BOTTLE[index]);
    }, delay);
  }

  applyBottleVariation(index) {
    if (index === 1) this.x -= 12;
    if (index === 2) this.x += 12;
  }

  newBottlePlacement(characterPosition) {
    let position = 200;
    do{ position= (characterPosition + (Math.random() - 0.5) * this.worldWidth * 2)
    }while (position < 200 || position > this.worldWidth * 4);
    return position;
  }





}
