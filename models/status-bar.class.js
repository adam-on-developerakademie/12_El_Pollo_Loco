class StatusBar extends DrawableObject {
  HEALTH_BAR = {x: 10, y: 0 ,percentage: 100, multiplier: 1, img:[
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/0.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/20.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/40.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/60.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/80.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/100.png",
  ]};

  BOTTLES_BAR = {x: 10, y: 50 ,percentage: 0, multiplier: 4, img:[
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/0.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/20.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/40.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/60.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/80.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/100.png",
  ]};

  LIFE_COINS_BAR = {x: 10, y: 100 ,percentage: 25, multiplier: 1, img:[
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/0.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/20.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/40.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/60.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/80.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/100.png",
  ]};

  BOSS_BAR = {x: 10, y: 150 ,percentage: 100, multiplier: 1, img:[
    "./img/7-statusbars/2-statusbar-endboss/green/green0.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green20.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green40.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green60.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green80.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green100.png",
  ] };


  statusBar = {};
   percentage;

  constructor(statusBar) {
    super();
    this.statusBar = eval(`this.${statusBar}`);
    this.loadImages(this.statusBar.img);
    this.percentage = this.statusBar.percentage;
    this.setPercentage(this.percentage)
    this.x = this.statusBar.x;
    this.y = this.statusBar.y;
    this.width = 200;
    this.height = 50;
  }

  setPercentage(percentage) {
    this.percentage = percentage * this.statusBar.multiplier;
    let path = this.statusBar.img[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 1) {
      return 1;
    } else {
      return 0;
    }
  }
}
