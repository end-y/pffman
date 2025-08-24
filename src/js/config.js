// Oyun konfigürasyon ayarları
export const GameConfig = {
  // Ekran ayarları
  SCREEN: {
    BACKGROUND_COLOR: 0xffbb37,
  },

  // Oyuncu ayarları
  PLAYER: {
    START_X: 150,
    START_Y: 200,
    JUMP_FORCE: 5.5,
    MOVE_SPEED: 2,
    SPRITE_WIDTH: 50.5,
    SPRITE_HEIGHT: 74,
  },

  // Fizik ayarları
  PHYSICS: {
    GRAVITY: 0.1,
  },

  // Platform ayarları
  PLATFORMS: [
    { x: 100, y: 400, width: 150, height: 20 },
    { x: 525, y: 400, width: 150, height: 20 },
    { x: 315, y: 250, width: 150, height: 20 },
    { x: 100, y: 100, width: 150, height: 20 },
    { x: 525, y: 100, width: 150, height: 20 },
  ],

  // Bomba ayarları
  BOMB: {
    SPRITE_WIDTH: 48,
    SPRITE_HEIGHT: 42,
    PLACEMENT: {
      MARGIN_FROM_EDGE: 20, // Platform kenarlarından uzaklık
    },
  },

  // Puff ayarları
  PUFF: {
    SPEED: 10,
    RANGE: 200,
  },

  // Zaman ayarları
  TIME: {
    GAME_DURATION: 20000,
    INITIAL_TIMER: 1250,
  },

  // Kontroller
  KEYS: {
    JUMP: 87, // W
    LEFT: 65, // A
    RIGHT: 68, // D
    PAUSE: 32, // Space
  },

  // Asset yolları
  ASSETS: {
    IMAGES: {
      CHARACTER: "assets/images/characters.png",
      BOMB: "assets/images/bomb.png",
      BOMBA: "assets/images/bomba.png",
      EXPLOSION: "assets/images/patlama.png",
      RESTART: "assets/images/restart.png",
      HOME: "assets/images/home.png",
      PUFF: "assets/images/puff.png",
      LOGO: "assets/images/logo.png",
    },
    FONTS: {
      GALIVER: "assets/fonts/GaliverSansObliquesBold-8DoM.ttf",
    },
  },
};
