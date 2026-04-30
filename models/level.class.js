class Level {
  lifeCoins;
  bottles;
  throwableObjects;
  enemies;
  boss;
  clouds;
  backgroundObjects;
  levelEndX;
  intervalIds = {};
  endScreens;

  /**
   * Creates a Level with all its object collections.
   * @param {LifeCoin[]} lifeCoins - Collectible coins placed in the level.
   * @param {Bottle[]} bottles - Ground bottles the character can pick up.
   * @param {ThrowableObject[]} throwableObjects - Bottles currently in flight.
   * @param {MovableObject[]} enemies - Normal enemy instances.
   * @param {Endboss[]} boss - The boss array (single entry).
   * @param {Cloud[]} clouds - Background cloud objects.
   * @param {BackgroundObject[]} backgroundObjects - Parallax background layers.
   * @param {number[]} levelEndX - Right boundary x coordinate(s) of the level.
   * @param {object} intervalIds - Registry of all active interval IDs.
   * @param {EndScreen[]} endScreens - Win / lose end-screen objects.
   */
  constructor(
    lifeCoins,
    bottles,
    throwableObjects,
    enemies,
    boss,
    clouds,
    backgroundObjects,
    levelEndX,
    intervalIds,
    endScreens,
  ) {
    this.lifeCoins = lifeCoins;
    this.bottles = bottles;
    this.throwableObjects = throwableObjects;
    this.enemies = enemies;
    this.boss = boss;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.levelEndX = levelEndX;
    this.intervalIds = intervalIds;
    this.endScreens = endScreens;
  }
}
