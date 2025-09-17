class Character extends MovableObject {
  IMAGES_WALKING = [
    "./img/2-character-pepe/2-walk/w-21.png",
    "./img/2-character-pepe/2-walk/w-22.png",
    "./img/2-character-pepe/2-walk/w-23.png",
    "./img/2-character-pepe/2-walk/w-24.png",
    "./img/2-character-pepe/2-walk/w-25.png",
    "./img/2-character-pepe/2-walk/w-26.png",
    "./img/2-character-pepe/2-walk/w-21.png",
  ];
  IMAGES_JUMPING = [
    //"./img/2-character-pepe/3-jump/j-31.png",
    //"./img/2-character-pepe/3-jump/j-32.png",
    //"./img/2-character-pepe/3-jump/j-33.png",
    "./img/2-character-pepe/3-jump/j-34.png",
    "./img/2-character-pepe/3-jump/j-35.png",
    "./img/2-character-pepe/3-jump/j-36.png",
    "./img/2-character-pepe/3-jump/j-37.png",
    "./img/2-character-pepe/3-jump/j-38.png",
    "./img/2-character-pepe/3-jump/j-39.png",
    "./img/2-character-pepe/3-jump/j-32.png",
    //"./img/2-character-pepe/3-jump/j-31.png",
  ];
  IMAGES_DEAD = [
    "./img/2-character-pepe/5-dead/d-51.png",
    "./img/2-character-pepe/5-dead/d-52.png",
    "./img/2-character-pepe/5-dead/d-53.png",
    "./img/2-character-pepe/5-dead/d-54.png",
    "./img/2-character-pepe/5-dead/d-55.png",
    "./img/2-character-pepe/5-dead/d-56.png",
    "./img/2-character-pepe/5-dead/d-57.png",
  ];
  IMAGES_HURT = [
    "img/2-character-pepe/4-hurt/h-41.png",
    "img/2-character-pepe/4-hurt/h-42.png",
    "img/2-character-pepe/4-hurt/h-43.png",
  ];
  IMAGE_STAY = ["./img/2-character-pepe/3-jump/j-31.png"];
  IMAGE_LOST = ["./img/You-won-you-lost/you-lost.png"];
  IMAGE_IDLE = [
    "./img/2-character-pepe/1-idle/idle/i-1.png",
    "./img/2-character-pepe/1-idle/idle/i-2.png",
    "./img/2-character-pepe/1-idle/idle/i-3.png",
    "./img/2-character-pepe/1-idle/idle/i-4.png",
    "./img/2-character-pepe/1-idle/idle/i-5.png",
    "./img/2-character-pepe/1-idle/idle/i-6.png",
    "./img/2-character-pepe/1-idle/idle/i-7.png",
    "./img/2-character-pepe/1-idle/idle/i-8.png",
    "./img/2-character-pepe/1-idle/idle/i-9.png",
    "./img/2-character-pepe/1-idle/idle/i-10.png",
  ];

  IMAGE_SLEEP = [
    "./img/2-character-pepe/1-idle/long-idle/i-11.png",
    "./img/2-character-pepe/1-idle/long-idle/i-12.png",
    "./img/2-character-pepe/1-idle/long-idle/i-13.png",
    "./img/2-character-pepe/1-idle/long-idle/i-14.png",
    "./img/2-character-pepe/1-idle/long-idle/i-15.png",
    "./img/2-character-pepe/1-idle/long-idle/i-16.png",
    "./img/2-character-pepe/1-idle/long-idle/i-17.png",
    "./img/2-character-pepe/1-idle/long-idle/i-18.png",
    "./img/2-character-pepe/1-idle/long-idle/i-19.png",
    "./img/2-character-pepe/1-idle/long-idle/i-20.png",
  ];

  soundWalk = new Audio("./audio/walk.wav");
  soundJump = new Audio("./audio/jump.wav");
  soundThrow = new Audio("./audio/throw.wav");
  soundHurt = new Audio("./audio/hurt.wav");
  soundDead = new Audio("./audio/dead.wav");
  soundCoin = new Audio("./audio/coin.wav");
  soundBottle = new Audio("./audio/bottle.ogg");
  soundChick= new Audio("./audio/chick.wav");

  world;
  y = 50;
  speed = 3;
  isThrowing = false;
  startGameTime = new Date().getTime();
  alive=true;

  constructor() {
    super().loadImage("./img/2-character-pepe/3-jump/j-31.png");
    this.actionDistance(90, 10, 30, 30);
    this.applyGravity();
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGE_STAY);
    this.loadImages(this.IMAGE_LOST);
    this.loadImages(this.IMAGE_IDLE);
    this.loadImages(this.IMAGE_SLEEP);
    this.lastMoveTime = new Date().getTime();
    this.run();
  }

  run() {
    this.buttonPressEvent();
    setInterval(() => {
      this.characterMove();
      this.playAnimations(new Date().getTime() - this.lastMoveTime);
      this.spawnBottle();
      this.throwBottle();
      this.bottleReloaded();
      this.world.camera_x = -this.x + 150;
      this.youLose();
      this.youWon();
    }, 1);
  }

  playAnimations(waitingTime) {
    if (this.isCharacterDead() && !this.world.level.boss[0].isDead()) {
      this.action = "dead";
      this.playAnimation(this.IMAGES_DEAD, this.soundDead);
    } else if (this.isHurt()) {
      this.action = "hurt";
      this.lastMoveTime = new Date().getTime();
      this.playAnimation(this.IMAGES_HURT, this.soundHurt);
    } else if (waitingTime > 1000) {
      this.playWaitingAnimation(waitingTime);
    } else this.playReadyAnimation();
  }

  playWaitingAnimation(waitingTime) {
    if (waitingTime < 5000 && this.action == !"jump") {
      this.playSequenceAnimation(this.IMAGE_IDLE, 2);
    } else if (waitingTime > 5000 && this.action == !"jump") {
      this.playSequenceAnimation(this.IMAGE_SLEEP, 3);
    }
  }

  playReadyAnimation() {
    if (this.action == "jump") {
      this.playAnimationJump(this.IMAGES_JUMPING, this.soundJump);
    } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround()) {
      this.playAnimationSlower(this.IMAGES_WALKING, this.soundWalk, 12);
    } else {
      this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
    }
  }

  throwBottle() {
    if (this.isReadyToThrow()) {
      this.isThrowing = true;
      let throwableBottle = new ThrowableObject(
        this.world.character.x,
        this.world.character.y,
        this.otherDirection,
        this.world.keyboard.RIGHT || this.world.keyboard.LEFT ? 1 : 0
      );
      this.world.level.throwableObjects.push(throwableBottle);
      this.world.pushIntervallIDs(
        "throwableObjects",
        throwableBottle.intervalId
      );
      this.soundThrow ? this.soundThrow.play() : null;
      this.world.character.bottlesNumber--;
      this.world.bottlesBar.setPercentage(this.world.character.bottlesNumber);
    }
  }

  isReadyToThrow() {
    if (this.world.character.bottlesNumber > 0) {
      if (this.world.keyboard.SPACE && !this.isThrowing) {
        return true;
      }
    }
    return false;
  }

  bottleReloaded() {
    if (!this.world.keyboard.SPACE) {
      this.isThrowing = false;
    }
  }

  spawnBottle() {
    if (Math.random() > 0.998 && this.world.level.bottles.length < 50) {
      let bottle = new Bottle(this.x);
      this.world.level.bottles.push(bottle);
    }
  }

  characterGoRight() {
    if (
      this.world.keyboard.RIGHT &&
      this.x < this.world.level.boss[0].x + 50 &&
      this.x < this.world.level.levelEndX
    ) {
      this.lastMoveTime = new Date().getTime();
      this.x += this.speed;
      this.otherDirection = false;
    }
  }

  characterGoLeft() {
    if (this.world.keyboard.LEFT && this.x > 150) {
      this.lastMoveTime = new Date().getTime();
      this.x -= this.speed;
      this.otherDirection = true;
    }
  }

  characterJump() {
    if (this.world.keyboard.UP && !this.isAboveGround()) {
      this.world.keyboard.UP = false;
      this.speedY = 20;
      if (new Date().getTime() > this.jumpTime + 800) {
        this.action = false;
        this.playSound = false;
      }
      if (this.action !== "jump") {
        this.action = "jump";
        this.jumpTime = new Date().getTime();
      }
      this.lastMoveTime = new Date().getTime();
    }
  }

  characterMove() {
    this.characterGoLeft();
    this.characterGoRight();
    this.characterJump();
  }

  killerJump(mo) {
    let checkThis =
      this.isColliding(mo) && this.speedY < 0 && this.isAboveGround() == true;
    if (checkThis) {
      mo.energy = 0;
      mo.dethTime = new Date().getTime();
      this.soundChick ? this.soundChick.play() : null;
    }
    return checkThis;
  }

  buttonPressEvent() {
    document.getElementById("left").addEventListener("touchstart", (event) => {
      event.preventDefault();
      this.world.keyboard.LEFT = true;
    });

    document.getElementById("left").addEventListener("touchend", (event) => {
      event.preventDefault();
      this.world.keyboard.LEFT = false;
    });

    document.getElementById("right").addEventListener("touchstart", (event) => {
      event.preventDefault();
      this.world.keyboard.RIGHT = true;
    });

    document.getElementById("right").addEventListener("touchend", (event) => {
      event.preventDefault();
      this.world.keyboard.RIGHT = false;
    });

    document.getElementById("jump").addEventListener("touchstart", (event) => {
      event.preventDefault();
      this.world.keyboard.UP = true;
    });

    document.getElementById("jump").addEventListener("touchend", (event) => {
      event.preventDefault();
      this.world.keyboard.UP = false;
    });

    document.getElementById("throw").addEventListener("touchstart", (event) => {
      event.preventDefault();
      this.world.keyboard.SPACE = true;
    });

    document.getElementById("throw").addEventListener("touchend", (event) => {
      event.preventDefault();
      this.world.keyboard.SPACE = false;
    });
  }

  isCharacterDead() {
    if (this.isDead()) {
      if (this.coinsNumber !== 0) {
        this.coinsNumber -= 25;
        this.world.coinsBar.setPercentage(this.coinsNumber);
        this.energy = 100;
        return false;
      } else {
        if (!this.world.level.boss[0].isDead()) {
          this.speedY = 20;
        }
        return true;
      }
    }
  }

  youLose() {
    if (this.isCharacterDead() && !this.world.level.boss[0].isDead()) {
      setTimeout(() => {
        this.world.level.endScreens[0].zoomIn(400, 200);
        setTimeout(() => {
          this.world.level.endScreens[0].newPosition(-720, 0, 0);
          this.world.level.endScreens[1].zoomIn(300, 200);
          setTimeout(() => this.world.gameOver(), 3000);
        }, 3000);
      }, 2000);
    }
  }

  youWon() {
    if (this.world.level.boss[0].isDead() && !this.isCharacterDead()) {
      setTimeout(() => {
        this.world.level.endScreens[2].zoomIn(600, 400);
        setTimeout(() => {
          this.world.level.endScreens[2].newPosition(-720, 0, 0);
          this.world.level.endScreens[1].zoomIn(300, 200);
          setTimeout(() => this.world.gameOver(), 3000);
        }, 3000);
      }, 2000);
    }
  }
}
