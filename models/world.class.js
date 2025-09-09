class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  coinsBar = new StatusBar("LIFE_COINS_BAR");
  healthBar = new StatusBar("HEALTH_BAR");
  bottlesBar = new StatusBar("BOTTLES_BAR");
  bossBar = new StatusBar("BOSS_BAR");

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    //this.draw();
    this.setWorld();
    //this.checkCollisions();
    this.startIntervallIDs();
  }

  setWorld() {
    this.character.world = this;
  }

  getLevel() {
    return this.level;
  }

  startIntervallIDs() {
    this.level.intervallIDs["checkCollisions"] = setInterval(() => {
      this.checkCollisions();
    }, 1);

    this.level.intervallIDs["draw"] = requestAnimationFrame(() => {
      this.draw();
    });
  }

  pushIntervallIDs(intervalName,intervalId) {
    if(!this.level.intervallIDs[intervalName]){this.level.intervallIDs[intervalName] = []}
    this.level.intervallIDs[intervalName].push(intervalId)
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.boss);
    this.addObjectsToMap(this.level.lifeCoins);
    this.addObjectsToMap(this.level.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.coinsBar);
    this.addToMap(this.healthBar);
    this.addToMap(this.bottlesBar);
    this.addToMap(this.bossBar);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(() => {
      self.draw();
    });
  }

  checkCollisions() {
   // setInterval(() => {
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

      this.level.lifeCoins.forEach((lifeCoins) => {
        if (this.character.isColliding(lifeCoins)) {
          this.character.takeLifeCoin(this.level.lifeCoins, this.level.lifeCoins.indexOf(lifeCoins));
          console.log(this.character.coinsNumber);
          this.coinsBar.setPercentage(this.character.coinsNumber);
        }
      });

      this.level.bottles.forEach((bottle) => {
        if (this.character.isColliding(bottle)) {
          this.character.takeBottle(this.level.bottles, this.level.bottles.indexOf(bottle));
          this.bottlesBar.setPercentage(this.character.bottlesNumber);
        }
      });

      this.level.throwableObjects.forEach((throwableBottle) => {
        if (this.level.boss[0].isColliding(throwableBottle)) {
          for (let i = 0; i < 5; i++) {
            let chick = new Chick(throwableBottle.x);
            this.level.enemies.push(chick);
          }
          this.level.boss[0].bottlesDamage(this.level.throwableObjects, this.level.throwableObjects.indexOf(throwableBottle)
          );
          this.bossBar.setPercentage(this.level.boss[0].energy);
          this.level.boss[0].waitForAttack = false;
        }
      });
     
      this.bossBar.setPercentage(this.level.boss[0].energy);
   //}, 1000 / 60);
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
