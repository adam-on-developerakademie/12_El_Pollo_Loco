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
    let random=Math.random();
    let i=0
    setTimeout(() => {  
    
    if(random>0.66){i=0}else if(random<0.33){i=1 , this.x-=12}else{i=2, this.x+=12};
    this.loadImage(this.IMAGES_BOTTLE[i]);

    }, 3000 + i * 10000);

    return i;
  }

  newBottlePlacement(characterPosition) {
    let position = -1;
    do{ position= (characterPosition + (Math.random() - 0.5) * this.worldWidth * 2)
    }while (position < 0 || position > this.worldWidth * 4);
    return position;
  }





}
