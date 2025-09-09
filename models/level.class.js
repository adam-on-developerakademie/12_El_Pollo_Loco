class Level {
  lifeCoins;
  bottles;
  throwableObjects;
  enemies;
  boss;
  clouds;
  backgroundObjects;
  levelEndX;
  intervallIDs = {};

  constructor(
    lifeCoins,
    bottles,
    throwableObjects,
    enemies,
    boss,
    clouds,
    backgroundObjects,
    levelEndX,
    intervallIDs
  ) {
    this.lifeCoins = lifeCoins;
    this.bottles = bottles;
    this.throwableObjects = throwableObjects;
    this.enemies = enemies;
    this.boss = boss;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.levelEndX = levelEndX;
    this.intervallIDs = intervallIDs;
  }
}
