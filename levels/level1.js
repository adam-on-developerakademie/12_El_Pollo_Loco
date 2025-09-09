const level1 = new Level(
  [ new LifeCoin(500), new LifeCoin(1500), new LifeCoin(2000), new LifeCoin(2500)],
  [new Bottle(100), new Bottle(200), new Bottle(300)],
  [new Chicken(0), new Chicken(0), new Chicken(0), new Chicken(0),
    new Chicken(1000), new Chicken(1000), new Chicken(1000), new Chicken(1000),
    new Chicken(2000), new Chicken(2000), new Chicken(2000), new Chicken(2000),
  ],
  [new Endboss()],
  [new Cloud(), new Cloud()],
  [
    new BackgroundObject("./img/5-background/layers/air.png",720    * -1),
    new BackgroundObject("./img/5-background/layers/3-third-layer/2.png",720   * -1),
    new BackgroundObject("./img/5-background/layers/2-second-layer/2.png",720 * -1),
    new BackgroundObject("./img/5-background/layers/1-first-layer/2.png",720 * -1),

    new BackgroundObject("./img/5-background/layers/air.png",0),
    new BackgroundObject("./img/5-background/layers/3-third-layer/1.png",0),
    new BackgroundObject("./img/5-background/layers/2-second-layer/1.png",0),
    new BackgroundObject("./img/5-background/layers/1-first-layer/1.png",0),
    new BackgroundObject("./img/5-background/layers/air.png",719),
    new BackgroundObject("./img/5-background/layers/3-third-layer/2.png",719),
    new BackgroundObject("./img/5-background/layers/2-second-layer/2.png",719),
    new BackgroundObject("./img/5-background/layers/1-first-layer/2.png",719),
   
    new BackgroundObject("./img/5-background/layers/air.png",719 * 2),
    new BackgroundObject("./img/5-background/layers/3-third-layer/1.png",719 * 2),
    new BackgroundObject("./img/5-background/layers/2-second-layer/1.png",719 * 2),
    new BackgroundObject("./img/5-background/layers/1-first-layer/1.png",719 * 2),
    new BackgroundObject("./img/5-background/layers/air.png",719 * 3),
    new BackgroundObject("./img/5-background/layers/3-third-layer/2.png",719 * 3),
    new BackgroundObject("./img/5-background/layers/2-second-layer/2.png",719 * 3),
    new BackgroundObject("./img/5-background/layers/1-first-layer/2.png",719 * 3),

    new BackgroundObject("./img/5-background/layers/air.png",719 * 4),
    new BackgroundObject("./img/5-background/layers/3-third-layer/1.png",719 * 4),
    new BackgroundObject("./img/5-background/layers/2-second-layer/1.png",719 * 4),
    new BackgroundObject("./img/5-background/layers/1-first-layer/1.png",719 * 4),
],
[
     720 * 4
],



);
