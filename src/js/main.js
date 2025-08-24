import { Game } from "./game/Game.js";

// Global start fonksiyonu - HTML'den çağrılır
window.start = async function (levelId = 1) {
  const game = new Game(levelId);
  await game.initialize();
};

// PIXI yüklendiğinde çağrılır
let loader;
async function onStart() {
  loader = PIXI.Loader.shared;
  console.log("PIXI yüklendi");
}

// Sayfa yüklendiğinde onStart'ı çağır
window.addEventListener("load", onStart);
