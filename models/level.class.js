class Level {
  bottles
  enemies;
  boss;
  clouds;
  backgroundObjects;
  levelEndX;

  constructor(bottles,enemies, boss, clouds, backgroundObjects, levelEndX) {
    this.bottles = bottles;
    this.enemies = enemies;
    this.boss = boss;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.levelEndX = levelEndX;

  }
}
