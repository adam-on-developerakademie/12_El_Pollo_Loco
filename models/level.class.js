class Level {
  enemies;
  boss;
  clouds;
  backgroundObjects;
  levelEndX;

  constructor(enemies, boss, clouds, backgroundObjects, levelEndX) {
    this.enemies = enemies;
    this.boss = boss;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.levelEndX = levelEndX;

  }
}
