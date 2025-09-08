class Level {
  lifeCoins;
  bottles;
  enemies;
  boss;
  clouds;
  backgroundObjects;
  levelEndX;

  constructor(
    lifeCoins,
    bottles,
    enemies,
    boss,
    clouds,
    backgroundObjects,
    levelEndX
  ) {
    this.lifeCoins = lifeCoins;
    this.bottles = bottles;
    this.enemies = enemies;
    this.boss = boss;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.levelEndX = levelEndX;
  }
}
