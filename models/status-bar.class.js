class StatusBar extends DrawableObject {
  LIFE_COINS_BAR = {x: 10, y: 0 ,percentage: 0, multiplier: 1, img:[
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/0.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/20.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/40.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/60.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/80.png",
    "./img/7-statusbars/1-statusbar/1-statusbar-coin/blue/100.png",
  ]};

  HEALTH_BAR = {x: 10, y: 50 ,percentage: 100, multiplier: 1, img:[
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/0.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/20.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/40.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/60.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/80.png",
    "./img/7-statusbars/1-statusbar/2-statusbar-health/green/100.png",
  ]};

  BOTTLES_BAR = {x: 10, y: 100 ,percentage: 0, multiplier: 4, img:[
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/0.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/20.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/40.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/60.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/80.png",
    "./img/7-statusbars/1-statusbar/3-statusbar-bottle/orange/100.png",
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

  /**
   * Creates a StatusBar using one of the named bar configurations.
   * @param {string} statusBar - Key of the bar definition to use (e.g. "HEALTH_BAR").
   */
  constructor(statusBar) {
    super();
    this.statusBar = this[statusBar];
    if (!this.statusBar) {
      throw new Error(`Unknown status bar: ${statusBar}`);
    }
    this.loadImages(this.statusBar.img);
    this.percentage = this.statusBar.percentage;
    this.setPercentage(this.percentage)
    this.x = this.statusBar.x;
    this.y = this.statusBar.y;
    this.width = 200;
    this.height = 50;
  }

  /**
   * Updates the displayed image to match the given percentage value.
   * @param {number} percentage - Current value (0–100) of the bar.
   */
  setPercentage(percentage) {
    this.percentage = percentage * this.statusBar.multiplier;
    let path = this.statusBar.img[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }
  /**
   * Maps the current percentage to an image array index (0–5).
   * @returns {number} Index into the bar's image array.
   */
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
