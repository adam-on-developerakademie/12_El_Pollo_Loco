class StatusBar extends DrawableObject {
  HEALTH_BAR = [
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/0.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/20.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/40.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/60.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/80.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/100.png",
  ];

  BOTTLE_BAR = [
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/0.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/20.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/40.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/60.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/80.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/100.png",
  ];

    COIN_BAR = [
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/0.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/20.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/40.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/60.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/80.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/100.png",
  ];

  BOSS_BAR = [
    "./img/7-statusbars/2-statusbar-endboss/green/green0.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green20.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green40.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green60.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green80.png",
    "./img/7-statusbars/2-statusbar-endboss/green/green100.png",
  ];  

  BARS_POSITIONS = {
    HEALTH_BAR: { x: 10, y: 0 },
    BOTTLE_BAR: { x: 10, y: 50 },
    COIN_BAR: { x: 10, y: 100 },
    BOSS_BAR: { x: 10, y: 150 },
  };

  statusBar = [];
  percentage = 100;

  constructor(statusBar) {
    super();
    this.statusBar = eval(`this.${statusBar}`);
    this.loadImages(this.statusBar);
    this.setPercentage(100);
    this.x = eval(`this.BARS_POSITIONS.${statusBar}.x`);
    this.y = eval(`this.BARS_POSITIONS.${statusBar}.y`);
    this.width = 200;
    this.height = 50;
  }

  setPercentage(percentage) {
    //console.log(this.statusBar);
    this.percentage = percentage;
    let path = this.statusBar[this.resolveImageIndex()];
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
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
