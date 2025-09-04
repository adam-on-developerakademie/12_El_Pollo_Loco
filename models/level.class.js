class Level {
  bottels
  enemies;
  boss;
  clouds;
  backgroundObjects;
  levelEndX;

  constructor(bottels,enemies, boss, clouds, backgroundObjects, levelEndX) {
    this.bottels = bottels;
    this.enemies = enemies;
    this.boss = boss;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.levelEndX = levelEndX;

  }
}
