class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  healthBar = new StatusBar("HEALTH_BAR");
  bottlesBar = new StatusBar("BOTTLES_BAR");
  coinsBar = new StatusBar("LIFE_COINS_BAR");
  bossBar = new StatusBar("BOSS_BAR");

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

  getLevel() {
    return this.level;
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
    this.addObjectsToMap(this.level.boss);
    this.addObjectsToMap(this.level.lifeCoins);
    this.addObjectsToMap(this.throwableObjects);

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

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        this.character.killerJump(enemy);
        if (this.character.isColliding(enemy)) {
          this.character.hit(0.3);
          this.healthBar.setPercentage(this.character.energy);
        }
      });
      if (this.character.isColliding(this.level.boss[0])) {
        this.character.hit(0.5);
        this.healthBar.setPercentage(this.character.energy);
      }

      this.bottles.forEach((bottle) => {
        if (this.character.isColliding(bottle)) {
          this.character.takeBottle(this.bottles, this.bottles.indexOf(bottle));
          this.bottlesBar.setPercentage(this.character.bottlesNumber);
        }
      });

      this.throwableObjects.forEach((bottle) => {
        if (this.level.boss[0].isColliding(bottle)) {
          for (let i = 0; i < 5; i++) {
            let chick = new Chick(bottle.x);
            this.level.enemies.push(chick);
          }
          this.level.boss[0].bottlesDamage(
            this.throwableObjects,
            this.throwableObjects.indexOf(bottle)
          );
          this.bossBar.setPercentage(this.level.boss[0].energy);
          this.level.boss[0].waitForAttack = false;
        }
      });

      this.coinsBar.setPercentage(this.character.coins);
      this.bossBar.setPercentage(this.level.boss[0].energy);
    }, 1000 / 60);
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
