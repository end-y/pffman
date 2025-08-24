import { GameConfig } from "../config.js";

export class PlatformManager {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.platforms = [];
  }

  createPlatforms() {
    GameConfig.PLATFORMS.forEach((platformData) => {
      this.addPlatform(
        platformData.x,
        platformData.y,
        platformData.width,
        platformData.height
      );
    });

    this.app.stage.addChild(this.container);
  }

  addPlatform(x, y, width, height) {
    const platform = new PIXI.Graphics();
    platform.beginFill(0x2c3e50);
    platform.hitArea = new PIXI.Rectangle(x + 50, y + 50, 120, 20);
    platform.drawRoundedRect(x, y, width, height, 10);
    platform.endFill();

    this.container.addChild(platform);
    this.platforms.push(platform);
  }

  getPlatforms() {
    return this.platforms;
  }

  getContainer() {
    return this.container;
  }
}
