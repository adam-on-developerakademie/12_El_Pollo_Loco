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

  world;
  y = 50;
  speed = 25;

  constructor() {
    super().loadImage("./img/2-character-pepe/3-jump/j-31.png");
    this.actionDistance(90, 10, 30, 30);
    this.applyGravity();
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGE_STAY);
    this.run();
  }

  run() {
    this.buttonPressEvent();
    setInterval(() => {
      this.characterMove();
      this.playAnimations();
      this.throwBottle();
      this.spawnBottle();
      this.world.camera_x = -this.x + 100;
    }, 1);
  }

  playAnimations() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD, 0);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT, 0);
    } else if (this.isAboveGround()) {
      this.playSequenceAnimation(this.IMAGES_JUMPING, 0.9);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playSequenceAnimation(this.IMAGES_WALKING, 0.4);
    } else {
      this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
    }
  }

  throwBottle() {
    if (this.world.character.bottlesNumber > 0) {
      if (this.world.keyboard.SPACE) {
        let nowTime = new Date().getTime();
        if (this.animationBusy < nowTime) {
          this.animationBusy = nowTime + 150;
          let throwableBottle = new ThrowableObject(
            this.world.character.x,
            this.world.character.y,
            this.otherDirection
          );
          this.world.throwableObjects.push(throwableBottle);
          this.world.character.bottlesNumber--;
          this.world.bottlesBar.setPercentage(
            this.world.character.bottlesNumber
          );
        }
      }
    }
  }

  spawnBottle() {
    if (Math.random() > 0.998 && this.world.bottles.length < 50) {
      this.lastMoveTime = new Date().getTime();
      let bottle = new Bottle(this.x);
      this.world.bottles.push(bottle);
      //console.log("bottle spawned:", bottle);
    }
  }

  characterGoRight() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
      this.lastMoveTime = new Date().getTime();
      this.x += this.speed / 10;
      this.otherDirection = false;
    }
  }

  characterGoLeft() {
    if (this.world.keyboard.LEFT && this.x > -500) {
      this.lastMoveTime = new Date().getTime();
      this.x -= this.speed / 10;
      this.otherDirection = true;
    }
  }

  characterJump() {
    if (this.world.keyboard.UP && this.isAboveGround() == false) {
      this.lastMoveTime = new Date().getTime();
      this.speedY = 20;
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
      console.log(this.isColliding(mo), this.speedY);
      this.world.level.enemies.splice(this.world.level.enemies.indexOf(mo), 1);

      let chicken = new Chicken(this.x);
      this.world.level.enemies.push(chicken);
      this.world.level.enemies.push(chicken);
      this.world.level.enemies.push(chicken);
      this.world.level.enemies.push(chicken);
      this.world.level.enemies.push(chicken);
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
}
