class Endboss extends MovableObject {
  IMAGES_WALKING = [
   // "./img/4-enemie-boss-chicken/1-walk/g1.png",
    "./img/4-enemie-boss-chicken/1-walk/g2.png",
   // "./img/4-enemie-boss-chicken/1-walk/g3.png",
    "./img/4-enemie-boss-chicken/1-walk/g4.png",
    "./img/4-enemie-boss-chicken/2-alert/g5.png",
    "./img/4-enemie-boss-chicken/2-alert/g6.png",
    "./img/4-enemie-boss-chicken/2-alert/g7.png",
    "./img/4-enemie-boss-chicken/2-alert/g8.png",
    "./img/4-enemie-boss-chicken/2-alert/g9.png",
    "./img/4-enemie-boss-chicken/2-alert/g10.png", 
    "./img/4-enemie-boss-chicken/2-alert/g11.png",
    "./img/4-enemie-boss-chicken/2-alert/g12.png",
  
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
     this.actionDistance(70, 120, 80, 50);
    this.x = 300;
    this.y = this.worldHight - this.height - 230;
    this.height = 400;
    this.width = 400;

    this.loadImages(this.IMAGES_WALKING);
    this.animate();
    
  }



  animate() {
  this.playAnimation(this.IMAGES_WALKING,300);

  }
}
