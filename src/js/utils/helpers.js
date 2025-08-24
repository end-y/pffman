// Yardımcı fonksiyonlar

// Çarpışma kontrolü
export function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Rastgele sayı üretimi
export function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// Timer sınıfı
export class Timer {
  constructor(fn, t) {
    this.fn = fn;
    this.interval = t;
    this.timerObj = setInterval(fn, t);
  }

  stop() {
    if (this.timerObj) {
      clearInterval(this.timerObj);
      this.timerObj = null;
    }
    return this;
  }

  start() {
    if (!this.timerObj) {
      this.stop();
      this.timerObj = setInterval(this.fn, this.interval);
    }
    return this;
  }

  reset(newT = this.interval) {
    this.interval = newT;
    return this.stop().start();
  }
}

// Texture atlas'tan sprite oluşturma
export function createSpriteFromAtlas(baseTexture, x, y, width, height) {
  return new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(x * width, y, width, height)
  );
}
