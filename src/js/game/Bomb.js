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
    this.sprite.anchor.set(0.5, 1); // Y anchor'u 1 yaparak bombanın alt kısmını referans al
    this.sprite.animationSpeed = 10;
    this.sprite.loop = true;
    this.sprite.x = x;
    this.sprite.y = y;

    // HitArea'yı sprite boyutlarına göre ayarla ve pozisyonu takip et
    this.updateHitArea();

    this.app.stage.addChild(this.sprite);

    // Debug için bomba çarpışma kutusunu göster (isteğe bağlı)
    // this.createDebugBox();
  }

  // Debug amaçlı - bomba çarpışma kutusunu görsel olarak gösterir
  createDebugBox() {
    this.debugBox = new PIXI.Graphics();
    this.debugBox.lineStyle(2, 0x00ff00, 1);
    this.debugBox.drawRect(0, 0, 1, 1);
    this.app.stage.addChild(this.debugBox);
    this.updateDebugBox();
  }

  // Debug kutusu güncelleme
  updateDebugBox() {
    if (this.debugBox && this.sprite) {
      const bounds = this.sprite.getBounds();
      this.debugBox.clear();
      this.debugBox.lineStyle(2, 0x00ff00, 1);
      this.debugBox.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }

  // Bombanın çarpışma alanını güncelle
  updateHitArea() {
    if (this.sprite) {
      const bounds = this.sprite.getBounds();
      this.sprite.hitArea = new PIXI.Rectangle(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height
      );
    }
  }

  // Bombanın çarpışma kutusunu döndür
  getCollisionBox() {
    if (!this.sprite) return null;

    const bounds = this.sprite.getBounds();
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };
  }

  destroy() {
    if (this.sprite) {
      this.app.stage.removeChild(this.sprite);
      this.sprite = null;
    }
  }
}
