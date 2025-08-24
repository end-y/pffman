import { GameConfig } from "../config.js";
import { Player } from "./Player.js";
import { Bomb } from "./Bomb.js";
import { PlatformManager } from "./Platform.js";
import { PuffManager } from "./PuffManager.js";
import { UIComponents } from "../ui/UIComponents.js";
import { checkCollision, getRandomIndex, Timer } from "../utils/helpers.js";

export class Game {
  constructor() {
    this.app = null;
    this.player = null;
    this.bomb = null;
    this.platformManager = null;
    this.puffManager = null;
    this.score = 0;
    this.scoreDisplay = null;
    this.timer = null;
    this.keys = {};
    this.isPaused = false;
    this.pauseScreen = null;
    this.gameOverScreen = null;
  }

  async initialize() {
    // Giriş ekranını gizle
    document.getElementById("giris").style.display = "none";

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

    // Debug kutusu güncelle (eğer aktifse)
    // this.player.updateDebugFootBox();
  }

  handleInput() {
    if (this.keys[GameConfig.KEYS.JUMP] && !this.player.isJumping) {
      this.player.jump();
    }

    if (this.keys[GameConfig.KEYS.LEFT]) {
      this.player.moveLeft();
    }

    if (this.keys[GameConfig.KEYS.RIGHT]) {
      this.player.moveRight();
    }
  }

  updatePhysics() {
    // Platform çarpışmalarını kontrol et - sadece ayak çarpışma alanını kullan
    let onPlatform = false;
    const platforms = this.platformManager.getPlatforms();
    const playerFootBox = this.player.getFootCollisionBox();

    for (const platform of platforms) {
      if (checkCollision(playerFootBox, platform.hitArea)) {
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
    for (const puff of puffs) {
      if (this.bomb.sprite && checkCollision(puff, this.bomb.sprite)) {
        this.onBombHit();
        break;
      }
    }
  }

  onBombHit() {
    this.score++;
    this.scoreDisplay.updateScore(this.score);
    this.placeBombRandomly();
    this.timer.reset(GameConfig.TIME.GAME_DURATION);
  }

  placeBombRandomly() {
    const platforms = this.platformManager.getPlatforms();
    const randomIndex = getRandomIndex(platforms.length);
    const platform = platforms[randomIndex];

    // Bombayı platformun ortasına ve üstüne yerleştir
    this.bomb.create(
      platform.hitArea.x + platform.hitArea.width / 2,
      platform.hitArea.y - 30
    );
  }

  sendPuff() {
    const direction = this.player.getCurrentDirection();
    this.player.setShootAnimation(direction);
    this.puffManager.createPuff(this.player);
  }

  onKeyDown(e) {
    this.keys[e.keyCode] = true;
  }

  onKeyUp(e) {
    this.keys[e.keyCode] = false;
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
    if (this.app.renderer.screen.height + 100 < this.player.sprite.y) {
      this.endGame();
    }
  }

  endGame() {
    this.timer.stop();
    this.showGameOverScreen();
    setTimeout(() => {
      this.app.stop();
    }, 500);
  }

  showGameOverScreen() {
    this.gameOverScreen = UIComponents.createGameOverScreen(
      this.app,
      this.score,
      () => this.restart(),
      () => this.goHome()
    );
    this.app.stage.addChild(this.gameOverScreen);
  }

  async restart() {
    await this.cleanup();
    const newGame = new Game();
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
