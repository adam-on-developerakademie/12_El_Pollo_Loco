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

  constructor(
    lifeCoins,
    bottles,
    throwableObjects,
    enemies,
    boss,
    clouds,
    backgroundObjects,
    levelEndX,
    intervalIds
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
  }
}
