// Oyun konfigürasyon ayarları
export const GameConfig = {
  // Ekran ayarları
  SCREEN: {
    BACKGROUND_COLOR: 0xffbb37,
    WIDTH: 800,
    HEIGHT: 600,
    BOUNDARY_MARGIN: 50, // Kamera dışına çıkma toleransı
  },

  // Oyuncu ayarları
  PLAYER: {
    START_X: 400, // Merkez platform üzerinde
    START_Y: 450, // İlk platform seviyesi (artırılmış aralığa uygun)
    JUMP_FORCE: 11.0, // Çok güçlü zıplama (maksimum artış)
    MOVE_SPEED: 2.5, // Biraz daha hızlı hareket
    AIR_CONTROL: 0.8, // Havadayken hareket kontrolü (%80)
    SPRITE_WIDTH: 50.5,
    SPRITE_HEIGHT: 74,
    MAX_FALL_SPEED: 12, // Maksimum düşme hızı
    COYOTE_TIME: 150, // Platform kenarından sonra zıplama süresi (ms)
    JUMP_BUFFER: 100, // Zıplama tuşuna erken basma toleransı (ms)
  },

  // Fizik ayarları
  PHYSICS: {
    GRAVITY: 0.35, // Daha güçlü yerçekimi
    AIR_RESISTANCE: 0.98, // Havada yavaşlama
    GROUND_FRICTION: 0.85, // Yerde sürtünme
  },

  // Platform ayarları - Başlangıç platformları (pattern uyumlu)
  PLATFORMS: [
    { x: 340, y: 500, width: 120, height: 20 }, // Başlangıç - merkez
    { x: 200, y: 430, width: 120, height: 20 }, // Sol (merkeze yakın)
    { x: 480, y: 360, width: 120, height: 20 }, // Sağ (merkeze yakın)
    { x: 200, y: 290, width: 120, height: 20 }, // Sol (merkeze yakın)
    { x: 480, y: 220, width: 120, height: 20 }, // Sağ (merkeze yakın)
    { x: 340, y: 150, width: 120, height: 20 }, // Merkez
  ],

  // Dinamik platform üretimi ayarları
  PLATFORM_GENERATION: {
    SCREEN_WIDTH: 800, // Ekran genişliği
    SCREEN_HEIGHT: 600, // Ekran yüksekliği
    PLATFORM_WIDTH: 120, // Sabit platform genişliği
    PLATFORM_HEIGHT: 20, // Platform yüksekliği
    VERTICAL_SPACING: 70, // Sabit dikey aralık (normal)
    PLATFORMS_AHEAD: 8, // Oyuncunun önünde kaç platform olsun
    GENERATION_TRIGGER_DISTANCE: 300, // Bu mesafede yeni platform üret

    // Pattern sistemi
    PATTERNS: [
      // Zigzag pattern - ana pattern
      {
        name: "zigzag",
        positions: ["left", "right", "left", "right"],
        weight: 4,
      },
      // Merkez-kenar pattern
      {
        name: "center_edge",
        positions: ["center", "left", "center", "right"],
        weight: 2,
      },
      // Üçlü pattern
      {
        name: "triple",
        positions: ["left", "center", "right", "center"],
        weight: 2,
      },
    ],

    // Pozisyon tanımları
    POSITIONS: {
      left: 200, // Sol kenar pozisyonu (merkeze yaklaştırıldı)
      center: 340, // Merkez pozisyonu (400 - 120/2)
      right: 480, // Sağ kenar pozisyonu (merkeze yaklaştırıldı)
    },
  },

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
