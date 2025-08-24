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

    // Platform ayarlarını uygula
    gameConfig.PLATFORMS = this.currentLevel.platforms;

    // Oyuncu ayarlarını uygula
    const playerConfig = this.currentLevel.player;
    gameConfig.PLAYER.START_X = playerConfig.startX;
    gameConfig.PLAYER.START_Y = playerConfig.startY;
    gameConfig.PLAYER.JUMP_FORCE = playerConfig.jumpForce;
    gameConfig.PLAYER.MOVE_SPEED = playerConfig.moveSpeed;

    // Platform üretim ayarlarını uygula
    const generation = this.currentLevel.generation;
    gameConfig.PLATFORM_GENERATION.VERTICAL_SPACING =
      generation.verticalSpacing;
    gameConfig.PLATFORM_GENERATION.PATTERNS = generation.patterns;
    gameConfig.PLATFORM_GENERATION.POSITIONS = generation.positions;

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
