import { GameConfig } from "../config.js";

export class UIComponents {
  static createButton(app, textureUrl, x, y, scale = 1, anchor = 0.5) {
    const texture = new PIXI.Texture.from(textureUrl);
    const button = new PIXI.Sprite(texture);

    button.anchor.set(anchor);
    button.scale.set(scale);
    button.buttonMode = true;
    button.interactive = true;
    button.x = x;
    button.y = y;

    return button;
  }

  static createBackground(app, alpha = 0.2) {
    const bg = new PIXI.Graphics();
    const alphaFilter = new PIXI.filters.AlphaFilter(alpha);

    bg.beginFill(0xf7931e);
    bg.filters = [alphaFilter];
    bg.drawRect(0, 0, app.renderer.screen.width, app.renderer.screen.height);
    bg.endFill();

    return bg;
  }

  static createExplosionBackground(app) {
    const bgTexture = new PIXI.Texture.from(GameConfig.ASSETS.IMAGES.EXPLOSION);
    const bgSprite = new PIXI.Sprite(bgTexture);

    bgSprite.anchor.set(0.5, 0.5);
    bgSprite.position.set(
      app.renderer.screen.width / 2,
      app.renderer.screen.height / 2
    );

    return bgSprite;
  }

  static createScoreText(score) {
    return new PIXI.Text(`Skor: ${score}`, {
      fontFamily: "Galiver",
      fontSize: 40,
      fill: 0x111,
    });
  }

  static createGameOverScreen(app, score, reason, onRestart, onHome) {
    const container = new PIXI.Container();

    // Arka plan
    const bg = this.createBackground(app);
    const explosionBg = this.createExplosionBackground(app);

    // Oyun bitiş sebebi metni
    const reasonText = new PIXI.Text(reason, {
      fontFamily: "Galiver",
      fontSize: 32,
      fill: 0xff0000,
    });
    reasonText.anchor.set(0.5, 0.5);
    reasonText.position.set(
      app.renderer.screen.width / 2,
      app.renderer.screen.height / 2 - 120
    );

    // Skor metni
    const scoreText = this.createScoreText(score);
    scoreText.anchor.set(0.5, 0.5);
    scoreText.position.set(
      app.renderer.screen.width / 2,
      app.renderer.screen.height / 2 - 80
    );

    // Butonlar
    const restartButton = this.createButton(
      app,
      GameConfig.ASSETS.IMAGES.RESTART,
      app.renderer.screen.width / 2 - 50,
      app.renderer.screen.height / 2,
      0.2
    );

    const homeButton = this.createButton(
      app,
      GameConfig.ASSETS.IMAGES.HOME,
      app.renderer.screen.width / 2 + 50,
      app.renderer.screen.height / 2,
      0.75
    );

    // Event listener'ları ekle
    restartButton.on("click", onRestart);
    homeButton.on("click", onHome);

    // Container'a ekle
    container.addChild(bg);
    container.addChild(explosionBg);
    container.addChild(reasonText);
    container.addChild(scoreText);
    container.addChild(restartButton);
    container.addChild(homeButton);

    return container;
  }

  static createPauseScreen(app, onRestart, onHome) {
    const container = new PIXI.Container();

    // Arka plan
    const bg = this.createBackground(app);
    const explosionBg = this.createExplosionBackground(app);

    // Butonlar
    const restartButton = this.createButton(
      app,
      GameConfig.ASSETS.IMAGES.RESTART,
      app.renderer.screen.width / 2 - 50,
      app.renderer.screen.height / 2,
      0.2
    );

    const homeButton = this.createButton(
      app,
      GameConfig.ASSETS.IMAGES.HOME,
      app.renderer.screen.width / 2 + 50,
      app.renderer.screen.height / 2,
      0.75
    );

    // Event listener'ları ekle
    restartButton.on("click", onRestart);
    homeButton.on("click", onHome);

    // Container'a ekle
    container.addChild(bg);
    container.addChild(explosionBg);
    container.addChild(restartButton);
    container.addChild(homeButton);

    return container;
  }

  static createScoreDisplay(app, initialScore = 0) {
    const scoreText = new PIXI.Text(initialScore, {
      fontFamily: "Galiver",
      fontSize: 40,
      fill: 0x2c3e50,
    });

    const bombIcon = new PIXI.Sprite(
      PIXI.Texture.from(GameConfig.ASSETS.IMAGES.BOMBA)
    );

    scoreText.anchor.set(0.5, 0.5);
    scoreText.position.set(700, 45);

    bombIcon.anchor.set(0.5);
    bombIcon.x = 750;
    bombIcon.y = 40;

    app.stage.addChild(scoreText);
    app.stage.addChild(bombIcon);

    return {
      scoreText,
      bombIcon,
      updateScore: (newScore) => {
        scoreText.text = newScore;
      },
    };
  }
}
