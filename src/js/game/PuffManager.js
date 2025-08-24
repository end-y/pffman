import { GameConfig } from "../config.js";

export class PuffManager {
  constructor(app) {
    this.app = app;
    this.puffs = [];
  }

  createPuff(player) {
    const puff = new PIXI.Sprite.from(GameConfig.ASSETS.IMAGES.PUFF);
    puff.anchor.set(0.5);

    const direction = player.getCurrentDirection();

    if (direction === "right") {
      puff.x = player.sprite.x + 50;
    } else {
      puff.x = player.sprite.x - 50;
    }

    puff.y = player.sprite.y;
    puff.speed = GameConfig.PUFF.SPEED;
    puff.direction = direction;
    // Collision detection için puff pozisyonunu kullanacağız

    this.app.stage.addChild(puff);
    this.puffs.push(puff);

    return puff;
  }

  updatePuffs(player) {
    for (let i = 0; i < this.puffs.length; i++) {
      const puff = this.puffs[i];

      if (puff.direction === "right") {
        puff.position.x += puff.speed;
        if (puff.position.x > player.sprite.x + GameConfig.PUFF.RANGE) {
          puff.dead = true;
        }
      } else {
        puff.position.x -= puff.speed;
        puff.rotation = 550;
        if (puff.position.x < player.sprite.x - GameConfig.PUFF.RANGE) {
          puff.dead = true;
        }
      }
    }

    // Ölü puff'ları temizle
    this.cleanupDeadPuffs();
  }

  cleanupDeadPuffs() {
    for (let i = this.puffs.length - 1; i >= 0; i--) {
      if (this.puffs[i].dead === true) {
        this.app.stage.removeChild(this.puffs[i]);
        this.puffs.splice(i, 1);
      }
    }
  }

  getPuffs() {
    return this.puffs;
  }

  clearAll() {
    this.puffs.forEach((puff) => {
      this.app.stage.removeChild(puff);
    });
    this.puffs = [];
  }
}
