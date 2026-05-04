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

  /**
   * Creates the player character, sets collision box, initialises speed and images,
   * and starts the gravity loop.
   */
  constructor() {
    super().loadImage("./img/2-character-pepe/3-jump/j-31.png");
    this.actionDistance(90, 10, 30, 30);
    this.initializeSpeed();
    this.applyGravity();
    this.initializeImages();
    this.lastMoveTime = new Date().getTime();
  }

}
