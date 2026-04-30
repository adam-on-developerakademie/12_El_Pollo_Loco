/** Player-controlled character. Handles input, movement, animations, and game-end conditions. */
class Character extends MovableObject {
  // --- Animation frame arrays ---
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
    "./img/2-character-pepe/3-jump/j-34.png",
    "./img/2-character-pepe/3-jump/j-35.png",
    "./img/2-character-pepe/3-jump/j-36.png",
    "./img/2-character-pepe/3-jump/j-37.png",
    "./img/2-character-pepe/3-jump/j-38.png",
    "./img/2-character-pepe/3-jump/j-39.png",
    "./img/2-character-pepe/3-jump/j-32.png",
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
  IMAGE_STAY   = ["./img/2-character-pepe/3-jump/j-31.png"];
  IMAGE_LOST   = ["./img/You-won-you-lost/you-lost.png"];
  IMAGE_IDLE   = [
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
  IMAGE_SLEEP  = [
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

  // --- Sound effects ---
  soundWalk   = new Audio("./audio/walk.wav");
  soundJump   = new Audio("./audio/jump.wav");
  soundThrow  = new Audio("./audio/throw.wav");
  soundHurt   = new Audio("./audio/hurt.wav");
  soundDead   = new Audio("./audio/dead.wav");
  soundCoin   = new Audio("./audio/coin.wav");
  soundBottle = new Audio("./audio/bottle.ogg");
  soundChick  = new Audio("./audio/chick.wav");
  soundHen    = new Audio("./audio/hen.wav");

  /** Reference to the World instance, set by World.setWorld(). */
  world;
  /** Initial vertical position (higher y = lower on screen; canvas origin is top-left). */
  y = 50;
  /** Horizontal movement speed in pixels per delta-time unit. */
  speed = 5.04;
  /** True while SPACE is held and a throw has already been fired this press. */
  isThrowing = false;
  /** Unix timestamp when the game session started. */
  startGameTime = new Date().getTime();
  /** True until the character plays the death animation once. */
  alive = true;
  /** Prevents youLose / youWon from triggering more than once. */
  gameEnded = false;
  /** True when the character was hit while airborne; cleared on landing. */
  hurtInAir = false;

  constructor() {
    super().loadImage("./img/2-character-pepe/3-jump/j-31.png");
    this.actionDistance(90, 10, 30, 30);
    this.initializeSpeed();
    this.applyGravity();
    this.initializeImages();
    this.lastMoveTime = new Date().getTime();
  }

  initializeSpeed() {
    if (typeof isMobileUserAgent === "function" && isMobileUserAgent()) {
      this.speed = 7.56;
    }
  }

  initializeImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGE_STAY);
    this.loadImages(this.IMAGE_LOST);
    this.loadImages(this.IMAGE_IDLE);
    this.loadImages(this.IMAGE_SLEEP);
  }

  /**
   * Starts the main character update loop at 60 Hz.
   * Each tick: reads input, moves, plays animations, handles throwing,
   * updates the camera position, and checks win/lose conditions.
   */
  run() {
    this.buttonPressEvent();
    let last = performance.now();
    this.runIntervalId = setInterval(() => {
      const now = performance.now();
      const dt = Math.min((now - last) / (1000 / 60), 3);
      last = now;
      if (!this.world || !this.world.level) {
        return;
      }
      this.characterMove(dt);
      this.playAnimations(new Date().getTime() - this.lastMoveTime, this.world.soundVolume);
      this.spawnBottle();
      this.throwBottle();
      this.bottleReloaded();
      this.updateCamera();
      if (typeof youLose === "function") youLose();
      if (typeof youWon === "function") youWon();
    }, 1000 / 60);
  }

  updateCamera() {
    const canvasWidth = 720;
    const levelWidth = this.world.level.levelEndX[0];
    this.world.camera_x = -this.x + 150;
    this.world.camera_x = Math.round(Math.min(0, Math.max(-(levelWidth - canvasWidth), this.world.camera_x)));
  }

  /**
   * Chooses and plays the correct animation based on the current game state.
   * Priority: dead > hurt/air-hurt > waiting (idle/sleep) > ready (walk/jump).
   * @param {number} waitingTime - Milliseconds since last movement.
   */
  playAnimations(waitingTime) {
    if (this.isCharacterDead() && !this.world.level.boss[0].isDead()) {
      this.action = "dead";
      this.playAnimation(this.IMAGES_DEAD, this.soundDead, this.world.soundVolume);
    } else if (this.isHurt() || this.isAirHurtActive()) {
      if (this.isAboveGround()) {
        this.hurtInAir = true;
      }
      this.action = "hurt";
      this.lastMoveTime = new Date().getTime();
      this.playAnimation(this.IMAGES_HURT, this.soundHurt, this.world.soundVolume);
    } else if (waitingTime > 1000) {
      this.playWaitingAnimation(waitingTime);
    } else {
      this.playReadyAnimation();
    }
  }

  /**
   * Plays the idle or sleep animation depending on how long the character has been still.
   * Jump animations take priority and suppress idle/sleep.
   * @param {number} waitingTime - Milliseconds since last movement.
   */
  playWaitingAnimation(waitingTime) {
    if (waitingTime < 2500 && this.action != "jump") {
      this.playSequenceAnimation(this.IMAGE_IDLE, 2, this.world.soundVolume);
    } else if (waitingTime > 2500 && this.action != "jump") {
      this.playSequenceAnimation(this.IMAGE_SLEEP, 3, this.world.soundVolume);
    }
  }

  /**
   * Plays the appropriate animation when the character is active (not waiting).
   * Shows the jump sequence, walk cycle, or a static pose as needed.
   */
  playReadyAnimation() {
    if (this.action == "jump") {
      this.playAnimationJump(this.IMAGES_JUMPING, this.soundJump, this.world.soundVolume);
    } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround()) {
      // Walk animation plays slightly slower than 60 Hz for a natural look.
      this.playAnimationSlower(this.IMAGES_WALKING, this.soundWalk, 2.6, this.world.soundVolume);
    } else if (this.isAboveGround()) {
      // Airborne without a formal jump action — show peak-jump pose.
      this.img = this.imageCache["./img/2-character-pepe/3-jump/j-39.png"];
    } else {
      // Standing still on the ground.
      this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
    }
  }

  /**
   * Returns true while the character is airborne after being hit.
   * Automatically clears the hurtInAir flag once the character lands.
   * @returns {boolean}
   */
  isAirHurtActive() {
    if (!this.hurtInAir) {
      return false;
    }
    if (!this.isAboveGround()) {
      this.hurtInAir = false;
      return false;
    }
    return true;
  }

  /**
   * Creates and launches a new ThrowableObject if the character has bottles
   * and SPACE is pressed for the first time this press cycle.
   */
  throwBottle() {
    if (this.isReadyToThrow()) {
      this.isThrowing = true;
      const throwableBottle = this.createThrowableBottle();
      this.registerThrowableBottle(throwableBottle);
      this.playThrowSound();
      this.consumeBottle();
    }
  }

  createThrowableBottle() {
    const movement = this.world.keyboard.RIGHT || this.world.keyboard.LEFT ? 1 : 0;
    return new ThrowableObject(this.x, this.y, this.otherDirection, movement);
  }

  registerThrowableBottle(throwableBottle) {
    this.world.level.throwableObjects.push(throwableBottle);
    this.world.pushIntervallIDs("throwableObjects", throwableBottle.intervalId);
  }

  playThrowSound() {
    this.soundThrow ? (this.soundThrow.play(), this.soundThrow.volume = this.world.soundVolume) : null;
  }

  consumeBottle() {
    this.world.character.bottlesNumber--;
    this.world.bottlesBar.setPercentage(this.world.character.bottlesNumber);
  }

  /**
   * Returns true when the character can throw: has a bottle and SPACE was just pressed.
   * @returns {boolean}
   */
  isReadyToThrow() {
    if (this.world.character.bottlesNumber > 0) {
      if (this.world.keyboard.SPACE && !this.isThrowing) {
        return true;
      }
    }
    return false;
  }

  /** Resets isThrowing once SPACE is released, allowing the next throw. */
  bottleReloaded() {
    if (!this.world.keyboard.SPACE) {
      this.isThrowing = false;
    }
  }

  /**
   * Randomly spawns a salsa bottle near the character''s position.
   * Capped at 50 bottles in the level at any time.
   */
  spawnBottle() {
    if (Math.random() > 0.995 && this.world.level.bottles.length < 50) {
      let bottle = new Bottle(this.x);
      this.world.level.bottles.push(bottle);
    }
  }

  /**
   * Moves the character to the right while within level and boss boundaries.
   * Updates lastMoveTime so idle/sleep timers reset.
   * @param {number} dt - Delta-time multiplier for device-independent speed.
   */
  characterGoRight(dt) {
    if (
      this.world.keyboard.RIGHT &&
      this.x < this.world.level.boss[0].x + 50 &&
      this.x < this.world.level.levelEndX
    ) {
      this.lastMoveTime = new Date().getTime();
      this.x += this.speed * dt;
      this.otherDirection = false;
    }
  }

  /**
   * Moves the character to the left, stopping at x = 150 (left boundary).
   * @param {number} dt - Delta-time multiplier for device-independent speed.
   */
  characterGoLeft(dt) {
    if (this.world.keyboard.LEFT && this.x > 150) {
      this.lastMoveTime = new Date().getTime();
      this.x -= this.speed * dt;
      this.otherDirection = true;
    }
  }

  /**
   * Initiates a jump when UP is pressed and the character is on the ground.
   * Prevents double-jumping via the isAboveGround() guard.
   */
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

  /**
   * Overrides MovableObject.hit to additionally set hurtInAir when hit while airborne.
   * @param {number} x - Damage amount.
   */
  hit(x) {
    let energyBeforeHit = this.energy;
    let lastHitBeforeHit = this.lastHit;
    super.hit(x);
    let tookDamage = this.energy < energyBeforeHit || this.lastHit !== lastHitBeforeHit;
    if (tookDamage && this.isAboveGround()) {
      this.hurtInAir = true;
    }
  }

  /**
   * Processes all movement inputs for one tick and clears the jump pose on landing.
   * @param {number} dt - Delta-time multiplier for device-independent speed.
   */
  characterMove(dt) {
    this.characterGoLeft(dt);
    this.characterGoRight(dt);
    this.characterJump();
    // Clear jump pose when the character lands (speedY <= 0 while on ground).
    if (!this.isAboveGround() && this.action == "jump" && this.speedY <= 0) {
      this.action = false;
      this.playSound = false;
      this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
    }
  }

  /**
   * Kills an enemy when the character lands on top of it (stomp mechanic).
   * Only triggers when falling (speedY < 0) while airborne.
   * @param {MovableObject} mo - The enemy to test against.
   * @returns {boolean} True if the enemy was stomped this tick.
   */
  killerJump(mo) {
    let checkThis =
      this.isColliding(mo) && this.speedY < 0 && this.isAboveGround() == true;
    if (checkThis) {
      mo.energy = 0;
      mo.dethTime = new Date().getTime();
      this.soundChick ? (this.soundChick.play(), this.soundChick.volume = this.world.soundVolume) : null;
    }
    return checkThis;
  }

  /** Binds all four on-screen control buttons to keyboard state keys. */
  buttonPressEvent() {
    this.bindControlButton("left", "LEFT");
    this.bindControlButton("right", "RIGHT");
    this.bindControlButton("jump", "UP");
    this.bindControlButton("throw", "SPACE");
  }

  /**
   * Attaches press/release handlers to a DOM button so it mirrors a keyboard key.
   * Handles touch, pointer, and mouse events for broad device compatibility.
   * @param {string} buttonId - ID of the DOM element to bind.
   * @param {string} key - Keyboard state key to set (e.g. "LEFT", "SPACE").
   */
  createKeyHandler(key, value) {
    return (event) => {
      if (event.cancelable) event.preventDefault();
      if (!this.world || !this.world.keyboard) return;
      this.world.keyboard[key] = value;
    };
  }

  bindControlButton(buttonId, key) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    const press   = this.createKeyHandler(key, true);
    const release = this.createKeyHandler(key, false);
    button.ontouchstart    = press;
    button.ontouchend      = release;
    button.ontouchcancel   = release;
    button.onpointerdown   = press;
    button.onpointerup     = release;
    button.onpointercancel = release;
    button.onpointerleave  = release;
    button.onmousedown     = press;
    button.onmouseup       = release;
    button.onmouseleave    = release;
  }

  /**
   * Returns true when the character is dead and has no coins left to spend.
   * If coins remain, spends 25 coins to revive instead of dying.
   * @returns {boolean}
   */
  isCharacterDead() {
    if (this.isDead()) {
      if (this.coinsNumber !== 0) {
        // Spend a coin life to revive.
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

}
