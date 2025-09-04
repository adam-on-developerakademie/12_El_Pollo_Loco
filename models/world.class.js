class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  healthBar = new StatusBar('HEALTH_BAR');
  bottlesBar = new StatusBar('BOTTLES_BAR');
  coinsBar = new StatusBar('COINS_BAR');
  bossBar = new StatusBar('BOSS_BAR');

  throwableObjects = [new ThrowableObject()];
  bottles = [new Bottle()];
  coins = [];


  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
    
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          //console.log(this.character.energy,this.character.bottles,this.character.coins);
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);
        }
      });
      this.bottles.forEach((bottle) => {
        if (this.character.isColliding(bottle)) {
          //console.log(this.character.energy,this.character.bottlesNumber,this.character.coins);
          this.character.takeBottle(this.bottles,this.bottles.indexOf(bottle)) 
          this.bottlesBar.setPercentage(this.character.bottlesNumber)}
      });

      this.coinsBar.setPercentage(this.character.coins);
      this.bossBar.setPercentage(this.character.energy);
    }, 1000 / 60);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addToMap(this.character);
    //this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.bottles);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.boss);

     this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthBar);
    this.addToMap(this.bottlesBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.bossBar);
    this.ctx.translate(this.camera_x, 0);

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
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrameBorder(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width + 2 * mo.x, 0);
    this.ctx.scale(-1, 1);
  }

  flipImageBack(mo) {
    this.ctx.restore();
  }
}
