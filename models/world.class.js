class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clauds = [new Cloud(), new Cloud()];
  backgroundObjects = [
    new BackgroundObject("./img/5-background/layers/air.png",0),
    new BackgroundObject("./img/5-background/layers/3-third-layer/1.png",0),
    new BackgroundObject("./img/5-background/layers/2-second-layer/1.png",0),
    new BackgroundObject("./img/5-background/layers/1-first-layer/1.png",0),
  ];
  ctx;
  canvas;
  keyboard;
  camera_x = 0;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.clauds);
    this.addObjectsToMap(this.enemies);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(() => {
      self.draw();
    });
  }
  
  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mo.width + 2 * mo.x, 0);
      this.ctx.scale(-1, 1);
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    if (mo.otherDirection) {
      this.ctx.restore();
    }
  }
 setWorld() {
    this.character.world = this;
  }

}
