import { GameConfig } from "../config.js";
import { getRandomIndex } from "../utils/helpers.js";

export class PlatformManager {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.platforms = [];
    this.highestPlatformY = 0; // En yüksek platformun Y pozisyonu
    this.platformIdCounter = 0; // Platform ID sayacı

    // Pattern sistemi için değişkenler
    this.currentPattern = null;
    this.currentPatternIndex = 0;
    this.patternStepCount = 0;
  }

  createPlatforms() {
    // Başlangıç platformlarını oluştur
    GameConfig.PLATFORMS.forEach((platformData) => {
      this.addPlatform(
        platformData.x,
        platformData.y,
        platformData.width,
        platformData.height
      );
    });

    // En yüksek platform Y pozisyonunu bul
    this.updateHighestPlatform();

    this.app.stage.addChild(this.container);
  }

  updateHighestPlatform() {
    this.highestPlatformY = Math.min(...this.platforms.map((p) => p.hitArea.y));
  }

  addPlatform(x, y, width, height) {
    const platform = new PIXI.Graphics();
    platform.beginFill(0x2c3e50);
    // HitArea'yı platform boyutlarıyla tam olarak eşleştir
    platform.hitArea = new PIXI.Rectangle(x, y, width, height);
    platform.drawRoundedRect(x, y, width, height, 10);
    platform.endFill();

    // Platform'a ID ve özellikler ekle
    platform.platformId = this.platformIdCounter++;
    platform.isGenerated = false; // Başlangıç platformları için false
    platform.isHidden = false; // Görünürlük durumu
    platform.originalAlpha = platform.alpha; // Orijinal şeffaflık

    this.container.addChild(platform);
    this.platforms.push(platform);
  }

  // Oyuncunun pozisyonuna göre yeni platformlar üret
  generatePlatformsIfNeeded(playerY) {
    const config = GameConfig.PLATFORM_GENERATION;

    // Eğer oyuncu yeterince yukarı çıktıysa yeni platformlar üret
    if (this.highestPlatformY - playerY < config.GENERATION_TRIGGER_DISTANCE) {
      this.generateNewPlatforms();
    }

    // Platform görünürlüğünü güncelle
    this.updatePlatformVisibility(playerY);

    // Ekranın çok altında kalan platformları temizle
    this.cleanupOldPlatforms(playerY);
  }

  // Platform görünürlük kontrolü
  updatePlatformVisibility(playerY) {
    const cameraY = playerY - 600 * 0.7; // Kamera pozisyonu yaklaşık
    const margin = 100; // Ekstra margin

    // Kamera görüş alanı
    const topBound = cameraY - margin;
    const bottomBound = cameraY + 600 + margin;

    this.platforms.forEach((platform) => {
      const platformY = platform.hitArea.y;
      const shouldBeVisible = platformY >= topBound && platformY <= bottomBound;

      if (shouldBeVisible && platform.isHidden) {
        // Platform tekrar görünür olmalı
        platform.isHidden = false;
        platform.alpha = platform.originalAlpha;
        platform.visible = true;
      } else if (!shouldBeVisible && !platform.isHidden) {
        // Platform gizlenmeli
        platform.isHidden = true;
        platform.alpha = 0.3; // Yarı şeffaf
        platform.visible = false; // Tamamen gizle
      }
    });
  }

  generateNewPlatforms() {
    const config = GameConfig.PLATFORM_GENERATION;

    // Kaç tane yeni platform üretmeli
    const platformsToGenerate = config.PLATFORMS_AHEAD;

    for (let i = 0; i < platformsToGenerate; i++) {
      this.generateSinglePlatformWithPattern();
    }

    this.updateHighestPlatform();
  }

  // Pattern tabanlı platform üretimi
  generateSinglePlatformWithPattern() {
    // Eğer pattern yoksa veya bitmiş ise yeni pattern seç
    if (
      !this.currentPattern ||
      this.currentPatternIndex >= this.currentPattern.positions.length
    ) {
      this.selectNewPattern();
    }

    // Mevcut pattern'dan pozisyon al
    const positionKey = this.currentPattern.positions[this.currentPatternIndex];
    const xPosition = GameConfig.PLATFORM_GENERATION.POSITIONS[positionKey];

    // Platform oluştur
    this.createPatternPlatform(xPosition);

    // Pattern index'i ilerlet
    this.currentPatternIndex++;
  }

  // Yeni pattern seç (ağırlığa göre rastgele)
  selectNewPattern() {
    const patterns = GameConfig.PLATFORM_GENERATION.PATTERNS;

    // Ağırlık toplamını hesapla
    const totalWeight = patterns.reduce(
      (sum, pattern) => sum + pattern.weight,
      0
    );

    // Rastgele sayı üret
    let random = Math.random() * totalWeight;

    // Ağırlığa göre pattern seç
    for (const pattern of patterns) {
      random -= pattern.weight;
      if (random <= 0) {
        this.currentPattern = pattern;
        this.currentPatternIndex = 0;
        this.patternStepCount = 0;
        break;
      }
    }
  }

  // Pattern'e göre platform oluştur
  createPatternPlatform(xPosition) {
    const config = GameConfig.PLATFORM_GENERATION;

    // Y pozisyonu hesapla (sabit aralık)
    const newY = this.highestPlatformY - config.VERTICAL_SPACING;

    // Platform oluştur
    const platform = new PIXI.Graphics();
    platform.beginFill(0x2c3e50);
    platform.hitArea = new PIXI.Rectangle(
      xPosition,
      newY,
      config.PLATFORM_WIDTH,
      config.PLATFORM_HEIGHT
    );
    platform.drawRoundedRect(
      xPosition,
      newY,
      config.PLATFORM_WIDTH,
      config.PLATFORM_HEIGHT,
      10
    );
    platform.endFill();
    platform.platformId = this.platformIdCounter++;
    platform.isGenerated = true;
    platform.isHidden = false; // Yeni platform görünür
    platform.originalAlpha = platform.alpha; // Orijinal şeffaflık

    this.container.addChild(platform);
    this.platforms.push(platform);
  }

  cleanupOldPlatforms(playerY) {
    const cleanupDistance = 800; // Oyuncunun 800px altındaki platformları temizle

    this.platforms = this.platforms.filter((platform) => {
      if (platform.hitArea.y > playerY + cleanupDistance) {
        this.container.removeChild(platform);
        return false;
      }
      return true;
    });
  }

  getPlatforms() {
    return this.platforms;
  }

  getContainer() {
    return this.container;
  }
}
