class Chicken extends MovableObject {

  IMAGES_WALKING = [
    "./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png",
    "./img/3-enemies-chicken/chicken-normal/1-walk/2-w.png",
    "./img/3-enemies-chicken/chicken-normal/1-walk/3-w.png",
  ];

  constructor() {
    super().loadImage("./img/3-enemies-chicken/chicken-normal/1-walk/1-w.png");
    this.height = this.height / 3;
    this.width = this.width / 2;
    this.y = 420 - this.height;
    this.x = 400 + Math.random() * 200;

this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

    animate() {
    setInterval(() => {
      let i = this.curentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path];
      this.curentImage++;
    }, 100);
  }


}
