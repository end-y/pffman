export class LevelManager {
  constructor() {
    this.currentLevel = null;
    this.currentLevelId = 1;
  }

  async loadLevel(levelId) {
    try {
      const response = await fetch(`assets/levels/level${levelId}.json`);
      if (!response.ok) {
        throw new Error(`Level ${levelId} bulunamadı`);
      }

      this.currentLevel = await response.json();
      this.currentLevelId = levelId;

      console.log(`Level ${levelId} yüklendi:`, this.currentLevel.name);
      return this.currentLevel;
    } catch (error) {
      console.error("Level yükleme hatası:", error);
      return null;
    }
  }

  getCurrentLevel() {
    return this.currentLevel;
  }

  getCurrentLevelId() {
    return this.currentLevelId;
  }

  getNextLevelId() {
    return this.currentLevel?.nextLevel || null;
  }

  hasNextLevel() {
    return this.getNextLevelId() !== null;
  }

  // Level verilerini GameConfig formatına çevir
  applyLevelToConfig(gameConfig) {
    if (!this.currentLevel) return gameConfig;

    // Map sistemi ayarlarını uygula
    if (this.currentLevel.map) {
      const mapConfig = this.currentLevel.map;
      gameConfig.MAP.LEVEL_MAP = mapConfig.levelMap;

      // platformSpacing'i PLATFORM_SPACING formatına çevir
      if (mapConfig.platformSpacing) {
        gameConfig.MAP.PLATFORM_SPACING = {
          HORIZONTAL: mapConfig.platformSpacing.horizontal,
          VERTICAL: mapConfig.platformSpacing.vertical,
        };
      }

      // platformSize'ı PLATFORM_SIZE formatına çevir
      if (mapConfig.platformSize) {
        gameConfig.MAP.PLATFORM_SIZE = {
          WIDTH: mapConfig.platformSize.width,
          HEIGHT: mapConfig.platformSize.height,
        };
      }

      // startPosition'ı START_POSITION formatına çevir
      if (mapConfig.startPosition) {
        gameConfig.MAP.START_POSITION = {
          X: mapConfig.startPosition.x,
          Y: mapConfig.startPosition.y,
        };
      }
    }

    // Oyuncu ayarlarını uygula
    const playerConfig = this.currentLevel.player;
    gameConfig.PLAYER.START_X = playerConfig.startX;
    gameConfig.PLAYER.START_Y = playerConfig.startY;
    gameConfig.PLAYER.JUMP_FORCE = playerConfig.jumpForce;
    gameConfig.PLAYER.MOVE_SPEED = playerConfig.moveSpeed;

    // Zaman ayarlarını uygula
    gameConfig.TIME.GAME_DURATION = this.currentLevel.timer;

    return gameConfig;
  }

  // Level skorlama kurallarını al
  getScoringRules() {
    return (
      this.currentLevel?.scoring || {
        bombPoints: 1,
        heightPoints: 0.1,
        timeBonus: false,
      }
    );
  }

  // Level bilgilerini al
  getLevelInfo() {
    if (!this.currentLevel) return null;

    return {
      id: this.currentLevel.id,
      name: this.currentLevel.name,
      description: this.currentLevel.description,
      difficulty: this.currentLevel.difficulty,
    };
  }

  // Tüm seviyeleri listele
  async getAllLevels() {
    const levels = [];
    let levelId = 1;

    while (true) {
      try {
        const response = await fetch(`assets/levels/level${levelId}.json`);
        if (!response.ok) break;

        const level = await response.json();
        levels.push({
          id: level.id,
          name: level.name,
          difficulty: level.difficulty,
          description: level.description,
        });

        levelId++;
      } catch (error) {
        break;
      }
    }

    return levels;
  }
}
