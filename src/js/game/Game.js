import { GameConfig } from "../config.js";
import { Player } from "./Player.js";
import { Bomb } from "./Bomb.js";
import { PlatformManager } from "./Platform.js";
import { PuffManager } from "./PuffManager.js";
import { LevelManager } from "./LevelManager.js";
import { UIComponents } from "../ui/UIComponents.js";
import { checkCollision, getRandomIndex, Timer } from "../utils/helpers.js";

export class Game {
  constructor(levelId = 1) {
    this.app = null;
    this.player = null;
    this.bomb = null;
    this.platformManager = null;
    this.puffManager = null;
    this.levelManager = new LevelManager();
    this.score = 0;
    this.scoreDisplay = null;
    this.timer = null;
    this.keys = {};
    this.isPaused = false;
    this.pauseScreen = null;
    this.gameOverScreen = null;
    this.currentLevelId = levelId;

    // Yükseklik tabanlı ilerleyiş takibi
    this.playerStartY = GameConfig.PLAYER.START_Y;
    this.highestReachedY = GameConfig.PLAYER.START_Y;
    this.heightScore = 0;
  }

  async initialize() {
    // Giriş ekranını gizle
    document.getElementById("giris").style.display = "none";

    // Level'i yükle ve config'i güncelle
    await this.loadCurrentLevel();

    // PIXI uygulamasını oluştur
    this.app = new PIXI.Application({
      backgroundColor: GameConfig.SCREEN.BACKGROUND_COLOR,
    });
    document.querySelector("#game").appendChild(this.app.view);

    // Asset'leri yükle
    await this.loadAssets();

    // Oyun bileşenlerini başlat
    this.initializeGameComponents();
    this.setupEventListeners();
    this.startGameLoop();
  }

  async loadCurrentLevel() {
    const level = await this.levelManager.loadLevel(this.currentLevelId);
    if (!level) {
      console.error("Level yüklenemedi, varsayılan ayarlar kullanılıyor");
      return;
    }

    // Level ayarlarını GameConfig'e uygula
    this.levelManager.applyLevelToConfig(GameConfig);

    // Start Y pozisyonunu güncelle
    this.playerStartY = GameConfig.PLAYER.START_Y;
    this.highestReachedY = GameConfig.PLAYER.START_Y;

    console.log(`Level ${level.id} başlatılıyor: ${level.name}`);
  }

  async loadAssets() {
    const loader = this.app.loader;

    loader.add("character", GameConfig.ASSETS.IMAGES.CHARACTER);
    loader.add("bomb", GameConfig.ASSETS.IMAGES.BOMB);
    loader.add("explosion", GameConfig.ASSETS.IMAGES.EXPLOSION);
    loader.add("restart", GameConfig.ASSETS.IMAGES.RESTART);
    loader.add("home", GameConfig.ASSETS.IMAGES.HOME);

    return new Promise((resolve) => {
      loader.load(() => {
        resolve();
      });
    });
  }

  initializeGameComponents() {
    // Platform yöneticisini oluştur
    this.platformManager = new PlatformManager(this.app);
    this.platformManager.createPlatforms();

    // Oyuncuyu oluştur
    this.player = new Player(this.app);
    this.player.createPlayerSheet();
    this.player.create();

    // Puff yöneticisini oluştur
    this.puffManager = new PuffManager(this.app);

    // Bombayı oluştur
    this.bomb = new Bomb(this.app);
    this.bomb.createBombSheet();
    this.placeBombRandomly();

    // Skor göstergesini oluştur
    this.scoreDisplay = UIComponents.createScoreDisplay(this.app, this.score);

    // Timer'ı başlat
    this.timer = new Timer(() => {
      this.endGame();
    }, GameConfig.TIME.GAME_DURATION);
  }

  setupEventListeners() {
    // Klavye olayları
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
    window.addEventListener("keypress", (e) => this.onKeyPress(e));

    // Mouse olayları
    document
      .querySelector("#game")
      .addEventListener("pointerdown", () => this.sendPuff());
  }

  startGameLoop() {
    this.app.ticker.add(() => this.gameLoop());
  }

  gameLoop() {
    if (this.isPaused) return;

    this.handleInput();
    this.updatePhysics();
    this.checkCollisions();
    this.puffManager.updatePuffs(this.player);
    this.checkGameOver();

    // Dinamik platform üretimi
    this.platformManager.generatePlatformsIfNeeded(this.player.sprite.y);

    // Yükseklik skorunu güncelle
    this.updateHeightScore();

    // Kamera takibi
    this.updateCamera();

    // Debug kutusu güncelle (eğer aktifse)
    // this.player.updateDebugFootBox();
  }

  handleInput() {
    // Hareket kontrolleri - sürekli basılı tutma destekli
    if (this.keys[GameConfig.KEYS.LEFT]) {
      this.player.moveLeft();
    } else if (this.keys[GameConfig.KEYS.RIGHT]) {
      this.player.moveRight();
    } else {
      // Hiçbir yön tuşu basılı değilse yavaşla
      if (!this.player.isJumping) {
        this.player.character.vx *= GameConfig.PHYSICS.GROUND_FRICTION;
      }
    }
  }

  updatePhysics() {
    // Platform çarpışmalarını kontrol et - sadece ayak çarpışma alanını ve görünür platformları kullan
    let onPlatform = false;
    const platforms = this.platformManager.getPlatforms();
    const playerFootBox = this.player.getFootCollisionBox();

    for (const platform of platforms) {
      // Sadece görünür (hidden olmayan) platformlarla çarpışma kontrol et
      if (
        !platform.isHidden &&
        checkCollision(playerFootBox, platform.hitArea)
      ) {
        // Sadece aşağıya düşerken platform üzerine çıkabilir
        if (this.player.character.vy > 0) {
          // Player'ı platform üzerine yerleştir
          this.player.sprite.y =
            platform.hitArea.y - this.player.sprite.height / 2;
          this.player.landOnPlatform();
          onPlatform = true;
          break;
        }
      }
    }

    if (!onPlatform) {
      this.player.updatePhysics();
    }

    this.player.wrapAroundScreen();
  }

  checkCollisions() {
    // Puff-bomba çarpışması kontrolü
    const puffs = this.puffManager.getPuffs();
    const bombCollisionBox = this.bomb.getCollisionBox();

    if (bombCollisionBox) {
      for (const puff of puffs) {
        const puffBounds = puff.getBounds();
        if (checkCollision(puffBounds, bombCollisionBox)) {
          this.onBombHit();
          break;
        }
      }
    }
  }

  onBombHit() {
    this.score++;
    this.updateScoreDisplay();
    this.placeBombRandomly();
    this.timer.reset(GameConfig.TIME.GAME_DURATION);
  }

  updateHeightScore() {
    const currentY = this.player.sprite.y;

    // Eğer oyuncu daha yukarı çıktıysa yükseklik skorunu güncelle
    if (currentY < this.highestReachedY) {
      this.highestReachedY = currentY;
      // Her 10 piksel yukarı çıkma için 1 puan
      this.heightScore = Math.floor(
        (this.playerStartY - this.highestReachedY) / 10
      );
      this.updateScoreDisplay();
    }
  }

  updateScoreDisplay() {
    const totalScore = this.score + this.heightScore;
    this.scoreDisplay.updateScore(totalScore);
  }

  updateCamera() {
    // Oyuncuyu takip eden kamera sistemi
    const targetY =
      this.player.sprite.y - this.app.renderer.screen.height * 0.7;
    const currentY = this.app.stage.y;

    // Yumuşak kamera takibi
    const lerpFactor = 0.1;
    const newY = currentY + (-targetY - currentY) * lerpFactor;

    // Kameranın aşağıya inmemesini engelle (sadece yukarı takip et)
    if (newY > this.app.stage.y) {
      this.app.stage.y = newY;

      // Skor display'ini kamera ile birlikte hareket ettir
      this.scoreDisplay.scoreText.y = -newY + 45;
      this.scoreDisplay.bombIcon.y = -newY + 40;
    }
  }

  placeBombRandomly() {
    // Kamera içindeki platformları filtrele
    const visiblePlatforms = this.getVisiblePlatforms();

    if (visiblePlatforms.length === 0) {
      console.warn("Görünür platform bulunamadı!");
      return;
    }

    const randomIndex = getRandomIndex(visiblePlatforms.length);
    const platform = visiblePlatforms[randomIndex];

    // Config'den bomba yerleştirme ayarlarını al
    const bombConfig = GameConfig.BOMB.PLACEMENT;

    // Platform üzerinde rastgele X pozisyonu (platform kenarlarından biraz içeride)
    const margin = bombConfig.MARGIN_FROM_EDGE;
    const minX = platform.hitArea.x + margin;
    const maxX = platform.hitArea.x + platform.hitArea.width - margin;
    const randomX = minX + Math.random() * (maxX - minX);

    // Y konumu hep platform üzerinde sabit
    this.bomb.create(randomX, platform.hitArea.y);
  }

  getVisiblePlatforms() {
    const platforms = this.platformManager.getPlatforms();
    const cameraY = -this.app.stage.y;
    const margin = GameConfig.SCREEN.BOUNDARY_MARGIN;

    // Kamera görüş alanı
    const topBound = cameraY - margin;
    const bottomBound = cameraY + GameConfig.SCREEN.HEIGHT + margin;
    const leftBound = -margin;
    const rightBound = GameConfig.SCREEN.WIDTH + margin;

    return platforms.filter((platform) => {
      const platformY = platform.hitArea.y;
      const platformX = platform.hitArea.x;
      const platformWidth = platform.hitArea.width;

      // Platform hem kamera içinde hem de gizli değil mi?
      return (
        !platform.isHidden &&
        platformY >= topBound &&
        platformY <= bottomBound &&
        platformX + platformWidth >= leftBound &&
        platformX <= rightBound
      );
    });
  }

  sendPuff() {
    const direction = this.player.getCurrentDirection();
    this.player.setShootAnimation(direction);
    this.puffManager.createPuff(this.player);
  }

  onKeyDown(e) {
    // Eğer tuş daha önce basılı değilse (ilk basışsa)
    if (!this.keys[e.keyCode]) {
      this.keys[e.keyCode] = true;

      // Zıplama tuşuna ilk basıldığında
      if (e.keyCode === GameConfig.KEYS.JUMP) {
        this.player.onJumpKeyPress();
      }
    }
  }

  onKeyUp(e) {
    this.keys[e.keyCode] = false;

    // Zıplama tuşu bırakıldığında
    if (e.keyCode === GameConfig.KEYS.JUMP) {
      this.player.onJumpKeyRelease();
    }
  }

  onKeyPress(e) {
    if (e.keyCode === GameConfig.KEYS.PAUSE) {
      this.togglePause();
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.showPauseScreen();
      this.timer.stop();
      this.app.stop();
    } else {
      this.hidePauseScreen();
      this.timer.start();
      this.app.start();
    }
  }

  showPauseScreen() {
    this.pauseScreen = UIComponents.createPauseScreen(
      this.app,
      () => this.restart(),
      () => this.goHome()
    );
    this.app.stage.addChild(this.pauseScreen);
  }

  hidePauseScreen() {
    if (this.pauseScreen) {
      this.app.stage.removeChild(this.pauseScreen);
      this.pauseScreen = null;
    }
  }

  checkGameOver() {
    // Ekranın altına düşme kontrolü
    if (this.app.renderer.screen.height + 100 < this.player.sprite.y) {
      this.endGame("Çok aşağı düştün!");
      return;
    }

    // Kamera sınırları kontrolü
    if (this.checkCameraBounds()) {
      this.endGame("Sahne dışına çıktın!");
      return;
    }

    // Bomba sahne kontrolü
    if (this.checkBombBounds()) {
      console.log("Bomba sınır dışı - oyun bitiyor!");
      this.endGame("Bomba sahne dışına çıktı!");
      return;
    }
  }

  checkCameraBounds() {
    const player = this.player.sprite;
    const margin = GameConfig.SCREEN.BOUNDARY_MARGIN;
    const cameraY = -this.app.stage.y;

    // Sol ve sağ sınırlar
    const leftBound = -margin;
    const rightBound = GameConfig.SCREEN.WIDTH + margin;

    // Üst ve alt sınırlar (kamera pozisyonuna göre)
    const topBound = cameraY - margin;
    const bottomBound = cameraY + GameConfig.SCREEN.HEIGHT + margin;

    return (
      player.x < leftBound ||
      player.x > rightBound ||
      player.y < topBound ||
      player.y > bottomBound
    );
  }

  checkBombBounds() {
    if (!this.bomb.sprite) return false;

    const bomb = this.bomb.sprite;
    const margin = GameConfig.SCREEN.BOUNDARY_MARGIN;
    const cameraY = -this.app.stage.y;

    // Sol ve sağ sınırlar
    const leftBound = -margin;
    const rightBound = GameConfig.SCREEN.WIDTH + margin;

    // Üst ve alt sınırlar (kamera pozisyonuna göre)
    const topBound = cameraY - margin;
    const bottomBound = cameraY + GameConfig.SCREEN.HEIGHT + margin;

    return (
      bomb.x < leftBound ||
      bomb.x > rightBound ||
      bomb.y < topBound ||
      bomb.y > bottomBound
    );
  }

  endGame(reason = "Oyun bitti!") {
    this.timer.stop();
    this.showGameOverScreen(reason);
    setTimeout(() => {
      this.app.stop();
    }, 500);
  }

  showGameOverScreen(reason = "Oyun bitti!") {
    this.gameOverScreen = UIComponents.createGameOverScreen(
      this.app,
      this.score,
      reason,
      () => this.restart(),
      () => this.goHome()
    );
    this.app.stage.addChild(this.gameOverScreen);
  }

  async restart() {
    await this.cleanup();
    const newGame = new Game(this.currentLevelId);
    await newGame.initialize();
  }

  goHome() {
    window.location.reload();
  }

  async cleanup() {
    await PIXI.utils.clearTextureCache();
    await PIXI.utils.destroyTextureCache();
    await this.app.loader.destroy();
    await this.app.destroy();

    const gameElement = document.body.children[2];
    if (gameElement && gameElement.children[0]) {
      gameElement.removeChild(gameElement.children[0]);
    }
  }
}
