import { GameConfig } from "../config.js";
import { createSpriteFromAtlas } from "../utils/helpers.js";

export class Bomb {
  constructor(app) {
    this.app = app;
    this.sprite = null;
    this.bombSheet = {};
  }

  createBombSheet() {
    const ssheet = new PIXI.BaseTexture.from(GameConfig.ASSETS.IMAGES.BOMB);
    const w = GameConfig.BOMB.SPRITE_WIDTH;
    const h = GameConfig.BOMB.SPRITE_HEIGHT;

    this.bombSheet = {
      bomb: [createSpriteFromAtlas(ssheet, 0, 0, w, h)],
    };
  }

  create(x, y) {
    // Önceki bombayı kaldır
    if (this.sprite) {
      this.app.stage.removeChild(this.sprite);
    }

    this.sprite = new PIXI.AnimatedSprite(this.bombSheet.bomb);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 10;
    this.sprite.loop = true;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.hitArea = new PIXI.Rectangle(x, y, 100, 100);

    this.app.stage.addChild(this.sprite);
  }

  destroy() {
    if (this.sprite) {
      this.app.stage.removeChild(this.sprite);
      this.sprite = null;
    }
  }
}
