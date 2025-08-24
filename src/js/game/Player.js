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

    // Gelişmiş zıplama için yeni özellikler
    this.coyoteTimer = 0; // Platform kenarından düştükten sonra zıplama süresi
    this.jumpBuffer = 0; // Zıplama tuşuna erken basma süresi
    this.lastGroundedTime = 0; // Son yerde olma zamanı
    this.jumpKeyPressed = false; // Zıplama tuşu durumu
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

    // Debug için ayak çarpışma kutusunu göster (isteğe bağlı)
    // this.createDebugFootBox();
  }

  // Debug amaçlı - ayak çarpışma kutusunu görsel olarak gösterir
  createDebugFootBox() {
    this.debugFootBox = new PIXI.Graphics();
    this.debugFootBox.lineStyle(2, 0xff0000, 1);
    this.debugFootBox.drawRect(0, 0, 1, 1);
    this.app.stage.addChild(this.debugFootBox);
  }

  // Debug kutusu güncelleme
  updateDebugFootBox() {
    if (this.debugFootBox) {
      const footBox = this.getFootCollisionBox();
      this.debugFootBox.clear();
      this.debugFootBox.lineStyle(2, 0xff0000, 1);
      this.debugFootBox.drawRect(
        footBox.x,
        footBox.y,
        footBox.width,
        footBox.height
      );
    }
  }

  // Player'ın ayak çarpışma alanını döndürür
  getFootCollisionBox() {
    const footHeight = 5; // Ayak yüksekliği (daha ince)
    const footWidth = this.sprite.width * 0.7; // Sprite genişliğinin %70'i

    return {
      x: this.sprite.x - footWidth / 2,
      y: this.sprite.y + this.sprite.height / 2 - footHeight,
      width: footWidth,
      height: footHeight,
    };
  }

  // Zıplama tuşuna basıldığında çağrılır
  onJumpKeyPress() {
    this.jumpKeyPressed = true;
    this.jumpBuffer = GameConfig.PLAYER.JUMP_BUFFER;
    this.attemptJump();
  }

  // Zıplama tuşu bırakıldığında çağrılır
  onJumpKeyRelease() {
    this.jumpKeyPressed = false;
    // Erken bırakılırsa zıplama gücünü azalt (değişken yükseklik zıplama)
    if (this.character.vy < 0) {
      this.character.vy *= 0.5;
    }
  }

  // Zıplama girişimi
  attemptJump() {
    const currentTime = Date.now();
    const canCoyoteJump =
      currentTime - this.lastGroundedTime < GameConfig.PLAYER.COYOTE_TIME;

    if (!this.isJumping || canCoyoteJump) {
      this.performJump();
      return true;
    }
    return false;
  }

  // Gerçek zıplama eylemi
  performJump() {
    this.character.vy = -GameConfig.PLAYER.JUMP_FORCE;
    this.isJumping = true;
    this.coyoteTimer = 0;
    this.jumpBuffer = 0;

    // Zıplama animasyonu
    this.setJumpAnimation();
  }

  // Zıplama animasyonu ayarla
  setJumpAnimation() {
    const direction = this.getCurrentDirection();
    if (direction === "left") {
      this.sprite.textures = this.playerSheet.jumpleft;
    } else {
      this.sprite.textures = this.playerSheet.jumpright;
    }
    this.sprite.play();
  }

  moveLeft() {
    const moveSpeed = this.isJumping
      ? GameConfig.PLAYER.MOVE_SPEED * GameConfig.PLAYER.AIR_CONTROL
      : GameConfig.PLAYER.MOVE_SPEED;

    // Havada değilse yürüme animasyonu göster
    if (!this.isJumping && !this.sprite.playing) {
      this.sprite.textures = this.playerSheet.walkLeft;
      this.sprite.play();
    }

    this.character.vx = -moveSpeed;
  }

  moveRight() {
    const moveSpeed = this.isJumping
      ? GameConfig.PLAYER.MOVE_SPEED * GameConfig.PLAYER.AIR_CONTROL
      : GameConfig.PLAYER.MOVE_SPEED;

    // Havada değilse yürüme animasyonu göster
    if (!this.isJumping && !this.sprite.playing) {
      this.sprite.textures = this.playerSheet.walkRight;
      this.sprite.play();
    }

    this.character.vx = moveSpeed;
  }

  updatePhysics() {
    // Yerçekimi uygula
    this.character.vy += GameConfig.PHYSICS.GRAVITY;

    // Maksimum düşme hızını sınırla
    if (this.character.vy > GameConfig.PLAYER.MAX_FALL_SPEED) {
      this.character.vy = GameConfig.PLAYER.MAX_FALL_SPEED;
    }

    // Pozisyon güncelle
    this.sprite.y += this.character.vy;
    this.sprite.x += this.character.vx;

    // Sürtünme ve hava direnci uygula
    if (this.isJumping) {
      // Havada hava direnci
      this.character.vx *= GameConfig.PHYSICS.AIR_RESISTANCE;
    } else {
      // Yerde sürtünme
      this.character.vx *= GameConfig.PHYSICS.GROUND_FRICTION;
    }

    // Timer'ları güncelle
    this.updateTimers();
  }

  updateTimers() {
    const deltaTime = 16; // Yaklaşık 60 FPS

    if (this.coyoteTimer > 0) {
      this.coyoteTimer -= deltaTime;
    }

    if (this.jumpBuffer > 0) {
      this.jumpBuffer -= deltaTime;
      // Eğer buffer süresi varsa ve şimdi zıplayabilir durumda isek, zıpla
      if (!this.isJumping && this.jumpBuffer > 0) {
        this.performJump();
      }
    }
  }

  landOnPlatform() {
    this.character.vy = 0;
    this.isJumping = false;
    this.sprite.jumping = false;
    this.lastGroundedTime = Date.now();
    this.coyoteTimer = GameConfig.PLAYER.COYOTE_TIME;

    // Eğer jump buffer varsa hemen zıpla
    if (this.jumpBuffer > 0) {
      this.performJump();
    }
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
