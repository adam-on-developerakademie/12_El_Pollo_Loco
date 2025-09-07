class Bottle extends MovableObject {
  IMAGES_BOTTLE = [
    "./img/6-salsa-bottle/1-salsa-bottle-on-ground.png",
    "./img/6-salsa-bottle/2-salsa-bottle-on-ground.png",
  ];

  y = this.worldHeight - this.height - 55;
  

  constructor(characterPosition) {
    super().loadImage(this.IMAGES_BOTTLE[this.setBottleImage()]);
    this.height = this.height / 4;
    this.width =  this.width / 2;
    this.y = -85
    this.x = this.newBottlePlacement(characterPosition)
    this.speed = 10 + Math.random() * 20;
    this.applyGravity()
  }


  setBottleImage() {
    let i = Math.round(Math.random());
    this.loadImage(this.IMAGES_BOTTLE[i]);
    return i;
  }

  newBottlePlacement(characterPosition) {
    let position = -1;
    do{ position= (characterPosition + (Math.random() - 0.5) * this.worldWidth * 2)
    }while (position < 0 || position > this.worldWidth * 4);
    return position;
  }



}
