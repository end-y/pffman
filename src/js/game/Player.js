import { GameConfig } from "../config.js";
import { createSpriteFromAtlas } from "../utils/helpers.js";

export class Player {
  constructor(app) {
    this.app = app;
    this.character = {
      x: GameConfig.PLAYER.START_X,
      y: GameConfig.PLAYER.START_Y,
      vy: 0,
      vx: 0,
    };
    this.sprite = null;
    this.playerSheet = {};
    this.isJumping = true;
  }

  createPlayerSheet() {
    const ssheet = new PIXI.BaseTexture.from(
      GameConfig.ASSETS.IMAGES.CHARACTER
    );
    const w = GameConfig.PLAYER.SPRITE_WIDTH;
    const h = GameConfig.PLAYER.SPRITE_HEIGHT;

    this.playerSheet = {
      standleft: [createSpriteFromAtlas(ssheet, 0, 0, w, h)],
      standright: [createSpriteFromAtlas(ssheet, 4, 0, w, h)],
      walkRight: [
        createSpriteFromAtlas(ssheet, 1, 0, w, h),
        createSpriteFromAtlas(ssheet, 2, 0, w, h),
        createSpriteFromAtlas(ssheet, 3, 0, w, h),
        createSpriteFromAtlas(ssheet, 0, 0, w, h),
      ],
      walkLeft: [
        createSpriteFromAtlas(ssheet, 5, 0, w, h),
        createSpriteFromAtlas(ssheet, 6, 0, w, h),
        createSpriteFromAtlas(ssheet, 7, 0, w, h),
        createSpriteFromAtlas(ssheet, 4, 0, w, h),
      ],
      jumpleft: [
        createSpriteFromAtlas(ssheet, 5, 0, w, h),
        createSpriteFromAtlas(ssheet, 4, 0, w, h),
      ],
      jumpright: [
        createSpriteFromAtlas(ssheet, 1, 0, w, h),
        createSpriteFromAtlas(ssheet, 0, 0, w, h),
      ],
      shootright: [
        createSpriteFromAtlas(ssheet, 8, 0, w, h),
        createSpriteFromAtlas(ssheet, 0, 0, w, h),
      ],
      shootleft: [
        createSpriteFromAtlas(ssheet, 9, 0, w, h),
        createSpriteFromAtlas(ssheet, 4, 0, w, h),
      ],
    };
  }

  create() {
    this.sprite = new PIXI.AnimatedSprite(this.playerSheet.standright);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.25;
    this.sprite.loop = false;
    this.sprite.interactive = true;
    this.sprite.x = this.character.x;
    this.sprite.y = this.character.y;
    this.sprite.jumping = this.isJumping;

    this.app.stage.addChild(this.sprite);
    this.sprite.play();
  }

  jump() {
    if (!this.isJumping) {
      this.character.vy -= GameConfig.PLAYER.JUMP_FORCE;
      this.sprite.y += this.character.vy;
      this.isJumping = true;
    }
  }

  moveLeft() {
    if (!this.sprite.playing) {
      this.sprite.textures = this.playerSheet.walkLeft;
      this.sprite.play();
    }
    this.sprite.x -= GameConfig.PLAYER.MOVE_SPEED;
  }

  moveRight() {
    if (!this.sprite.playing) {
      this.sprite.textures = this.playerSheet.walkRight;
      this.sprite.play();
    }
    this.sprite.x += GameConfig.PLAYER.MOVE_SPEED;
  }

  updatePhysics() {
    this.character.vy += GameConfig.PHYSICS.GRAVITY;
    this.sprite.y += this.character.vy;
    this.sprite.x += this.character.vx;
  }

  landOnPlatform() {
    this.character.vy = 0;
    this.character.vx = 0;
    this.isJumping = false;
    this.sprite.jumping = false;
  }

  wrapAroundScreen() {
    if (this.sprite.x < -32) {
      this.sprite.x = 800;
    } else if (this.sprite.x > 800) {
      this.sprite.x = -32;
    }
  }

  getCurrentDirection() {
    const textures = this.sprite.textures;
    if (
      textures === this.playerSheet.walkLeft ||
      textures === this.playerSheet.standleft ||
      textures === this.playerSheet.shootleft
    ) {
      return "left";
    }
    return "right";
  }

  setShootAnimation(direction) {
    if (!this.sprite.playing) {
      if (direction === "left") {
        this.sprite.textures = this.playerSheet.shootleft;
      } else {
        this.sprite.textures = this.playerSheet.shootright;
      }
      this.sprite.play();
    }
  }
}
