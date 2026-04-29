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
  bossBarUnlocked = false;
  killedChicks = 0;
  killedChickens = 0;
  isRunning = true;
  animationFrameId = null;
 



  constructor(canvas, soundVolume) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.soundVolume = soundVolume;
    this.setWorld();
    this.character.run();
    this.startIntervallIDs();
  }

  setWorld() {
    this.character.world = this;
  }

  getLevel() {
    return this.level;
  }

  startIntervallIDs() {
    this.isRunning = true;
    this.level.intervalIds["checkCollisions"] = setInterval(() => {
      this.checkCollisions();
    }, 1000 / 60);

    this.animationFrameId = requestAnimationFrame(() => {
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
    if (!this.isRunning || !this.level) {
      return;
    }

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
    if (this.shouldShowBossBar()) {
      this.addToMap(this.bossBar);
    }
    this.addObjectsToMap(this.level.endScreens);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    this.animationFrameId = requestAnimationFrame(() => {
      self.draw();
    });
  }

  shouldShowBossBar() {
    if (this.bossBarUnlocked) {
      return true;
    }

    let boss = this.level.boss[0];

    if (!boss) {
      return false;
    }

    let bossScreenLeft = boss.x + this.camera_x;
    let bossScreenRight = bossScreenLeft + boss.width;
    let bossIsVisible = bossScreenRight > 0 && bossScreenLeft < this.canvas.width;

    if (bossIsVisible) {
      this.bossBarUnlocked = true;
      this.spawnInitialChicks(boss.x);
    }

    return bossIsVisible;
  }

  spawnInitialChicks(bossX) {
    for (let i = 0; i < 5; i++) {
      this.level.enemies.push(new Chick(bossX));
    }
    document.getElementById("chicks").innerHTML = this.level.enemies.filter(
      (e) => e instanceof Chick
    ).length;
  }

  checkCollisions() {
    this.checkCollisionsBottleAndEnemies();

    this.level.enemies.forEach((enemy) => {
      this.character.killerJump(enemy);
      if (this.character.isColliding(enemy) && !this.level.boss[0].isDead()) {
        this.character.hit(0.45);
        this.healthBar.setPercentage(this.character.energy);
      }
    });
    if (this.character.isColliding(this.level.boss[0]) && !this.level.boss[0].isDead()) {
      this.character.hit(0.7);
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
          chick.isSpawned = true;
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
    this.cleanGroundBottles();
  }

  checkCollisionsBottleAndEnemies() {
    const now = new Date().getTime();
    this.level.enemies.forEach((enemy) => {
      this.level.throwableObjects.forEach((throwableBottle) => {
        if (enemy.isColliding(throwableBottle) && !throwableBottle.isDamaged) {
          throwableBottle.isDamaged = true;
          enemy.energy = 0;
          enemy.dethTime = now;
          this.soundChick ? this.soundChick.play() : null;
          this.soundChick ? (this.soundChick.volume = this.soundVolume) : null;
          setTimeout(() => {
            const idx = this.level.throwableObjects.indexOf(throwableBottle);
            if (idx !== -1) this.level.throwableObjects.splice(idx, 1);
          }, 2000);
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
    const toRemove = this.level.enemies.filter(
      (e) => e.dethTime > 0 && e.dethTime < new Date().getTime() - 1000
    );

    toRemove.forEach((enemy) => {
      enemy.dethTime = 0;
      this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);

      if (enemy instanceof Chicken) {
        this.killedChickens++;
        document.getElementById("killedChickens").innerHTML = this.killedChickens;
      } else if (enemy instanceof Chick) {
        this.killedChicks++;
        document.getElementById("killedChicks").innerHTML = this.killedChicks;
      }

      document.getElementById("chickens").innerHTML =
        this.level.enemies.filter((e) => e instanceof Chicken).length;
      document.getElementById("chicks").innerHTML =
        this.level.enemies.filter((e) => e instanceof Chick).length;

      if (enemy instanceof Chicken) {
        this.addNewChicken(2, enemy.x);
      }
    });
  }

  addNewChicken(chickensNumber, position) {
    for (let i = 0; i < chickensNumber; i++) {
      this.level.enemies.push(new Chicken(position));
    }
  }

  cleanGroundBottles() {
    for (let i = this.level.throwableObjects.length - 1; i >= 0; i--) {
      const bottle = this.level.throwableObjects[i];
      if (!bottle.isDamaged && bottle.y > this.canvas.height) {
        this.level.throwableObjects.splice(i, 1);
      }
    }
  }

  clearAllIntervalIds() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.clearObjectIntervals(this.character);

    if (this.level) {
      this.clearLevelIntervalIds();
      this.level.enemies.forEach((enemy) => this.clearObjectIntervals(enemy));
      this.level.boss.forEach((boss) => this.clearObjectIntervals(boss));
      this.level.throwableObjects.forEach((obj) => this.clearObjectIntervals(obj));
      this.level.bottles.forEach((obj) => this.clearObjectIntervals(obj));
      this.level.lifeCoins.forEach((obj) => this.clearObjectIntervals(obj));
      this.level.clouds.forEach((obj) => this.clearObjectIntervals(obj));
      this.level.endScreens.forEach((obj) => this.clearObjectIntervals(obj));
    }
  }

  clearLevelIntervalIds() {
    if (!this.level || !this.level.intervalIds) {
      return;
    }

    Object.values(this.level.intervalIds).forEach((entry) => {
      if (Array.isArray(entry)) {
        entry.forEach((id) => {
          if (typeof id === "number") {
            clearInterval(id);
          }
        });
      } else if (typeof entry === "number") {
        clearInterval(entry);
      }
    });
  }

  clearObjectIntervals(obj) {
    if (!obj) {
      return;
    }

    Object.keys(obj).forEach((key) => {
      if (/interval/i.test(key) && typeof obj[key] === "number") {
        clearInterval(obj[key]);
        obj[key] = null;
      }
    });
  }

  gameOver() {
    stopGameMusic();
    this.clearAllIntervalIds();
    this.cleanupLevel();
    document.getElementById("canvas").classList.add("displayNone");
    document.getElementById("startScreen").classList.remove("displayNone");
    document.getElementById("header").classList.remove("displayNone");
    document.getElementById("mobileButtons").classList.remove("center");
    document.getElementById("footer").classList.remove("displayNone");
    document.getElementById("overlay").classList.add("displayNone");
  }

  cleanupLevel() {
    this.character.world = null;
    this.level.enemies = [];
    this.level.throwableObjects = [];
    this.level.bottles = [];
    this.level.lifeCoins = [];
    this.level.clouds = [];
    this.level.intervalIds = {};
    this.level = null;
    world = null;
  }



}
