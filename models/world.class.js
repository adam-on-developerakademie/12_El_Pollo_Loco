class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  startTime;
  keyboard;
  camera_x = 0;
  coinsBar = new StatusBar("LIFE_COINS_BAR");
  healthBar = new StatusBar("HEALTH_BAR");
  bottlesBar = new StatusBar("BOTTLES_BAR");
  bossBar = new StatusBar("BOSS_BAR");
  soundChick = new Audio("./audio/chick.wav");
  soundHen = new Audio("./audio/hen.wav");
  soundVolume = 0.1;
  musicOn = false
 



  constructor(canvas, soundVolume) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.soundVolume = soundVolume;
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
    this.level.intervalIds["checkCollisions"] = setInterval(() => {
      this.checkCollisions();
    }, 1);

    this.level.intervalIds["draw"] = requestAnimationFrame(() => {
      this.draw();
    });
  }

  pushIntervallIDs(intervalName, intervalId) {
    if (!this.level.intervalIds[intervalName]) {
      this.level.intervalIds[intervalName] = [];
    }
    this.level.intervalIds[intervalName].push(intervalId);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.boss);
    this.addObjectsToMap(this.level.lifeCoins);
    this.addObjectsToMap(this.level.throwableObjects);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.coinsBar);
    this.addToMap(this.healthBar);
    this.addToMap(this.bottlesBar);
    this.addToMap(this.bossBar);
    this.addObjectsToMap(this.level.endScreens);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(() => {
      self.draw();
    });
  }

  checkCollisions() {
    // setInterval(() => {
    this.checkCollisionsBottleAndEnemies();

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
      if (
        this.character.isColliding(lifeCoins) &&
        !this.character.isCharacterDead()
      ) {
        this.character.takeLifeCoin(
          this.level.lifeCoins,
          this.level.lifeCoins.indexOf(lifeCoins)
        );
        this.coinsBar.setPercentage(this.character.coinsNumber);
      }
    });

    this.level.bottles.forEach((bottle) => {
      if (this.character.isColliding(bottle)) {
        this.character.takeBottle(
          this.level.bottles,
          this.level.bottles.indexOf(bottle),
          this.soundVolume
        );
        this.bottlesBar.setPercentage(this.character.bottlesNumber);
      }
    });

    this.level.throwableObjects.forEach((throwableBottle) => {
      if (
        this.level.boss[0].isColliding(throwableBottle) &&
        !throwableBottle.isDamaged
      ) {
        throwableBottle.isDamaged = true;
        this.soundHen ? this.soundHen.play() : null;
        this.soundHen ? (this.soundHen.volume = this.soundVolume) : null;
        this.level.boss[0].energy -= 15;
        if (this.level.boss[0].energy < 0) {
          this.level.boss[0].energy = 0;
        }
        this.bossBar.setPercentage(this.level.boss[0].energy);
        this.level.boss[0].waitForAttack = false;
        for (let i = 0; i < 5; i++) {
          let chick = new Chick(throwableBottle.x);
          this.level.enemies.push(chick);
        }
        document.getElementById("chicks").innerHTML = this.level.enemies.filter(
          (e) => e instanceof Chick
        ).length;
        setTimeout(() => {
          this.level.boss[0].bottlesDamage(
            this.level.throwableObjects,
            this.level.throwableObjects.indexOf(throwableBottle)
          );
        }, 2000);
      }
    });

    this.bossBar.setPercentage(this.level.boss[0].energy);
    this.cleanDeathEnemies();
    //}, 1000 / 60);   
  }

  checkCollisionsBottleAndEnemies() {
    this.level.enemies.forEach((enemy) => {
      this.level.throwableObjects.forEach((throwableBottle) => {
        if (enemy.isColliding(throwableBottle)) {
          enemy.energy = 0;
          enemy.dethTime = new Date().getTime();
          this.soundChick ? this.soundChick.play() : null;
          this.soundChick ? (this.soundChick.volume = this.soundVolume) : null;
        }
      });
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

  cleanDeathEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (0 < enemy.dethTime && enemy.dethTime < new Date().getTime() - 1000) {
        document.getElementById("chickens").innerHTML =
          this.level.enemies.filter((e) => e instanceof Chicken).length;
        document.getElementById("chicks").innerHTML = this.level.enemies.filter(
          (e) => e instanceof Chick
        ).length;
        this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
        this.addNewChicken(2, enemy.x);
      }
    });
  }

  addNewChicken(chickensNumber, position) {
    let chicken = new Chicken(position);
    for (let i = 0; i < chickensNumber; i++) {
      this.level.enemies.push(chicken);
    }
  }

  clearAllIntervalIds() {
    for (let i = 0; i < 999999; i++) {
      window.clearInterval(i);
    }
  }

  gameOver() {
    stopGameMusic() 
    this.clearAllIntervalIds();
    document.getElementById("canvas").classList.add("displayNone");
    document.getElementById("startScreen").classList.remove("displayNone");
    document.getElementById("header").classList.remove("displayNone");
    document.getElementById("mobileButtons").classList.remove("center");
    document.getElementById("footer").classList.remove("displayNone");
    document.getElementById("overlay").classList.add("displayNone");
    
    
  }



}
