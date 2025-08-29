class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clauds = [new Cloud(), new Cloud()];
  backgroundObjects = [
    new BackgroundObject("../img/5_background/layers/3_third_layer/1.png",0,0, 720,480),
  ];
  ctx;
  canvas;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addToMap(this.character);
    this.addObjectsToMap(this.clauds);
    this.addObjectsToMap(this.enemies);

    this.addObjectsToMap(this.backgroundObjects);
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
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
  }
}
