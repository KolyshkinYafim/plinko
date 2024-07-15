import {
  Sprite as PixiSprite,
  Texture as PixiTexture,
  Text as PixiText,
} from "pixi.js";
import Engine from "app/Engine";
import Application from "./app/Application";
import PlayBall from "entities/playball";
import { Pyramid } from "entities/pyramid";
import getRandomColor from "helpers/getRandomColor";
import {
  autoPlayModeState,
  balance,
  playBalls,
  playMode,
  pyramidSettings,
  settings,
} from "./constants/index";
import Table from "ui/table";
import CounterBlock from "ui/autoModeSelection";
import LinesSelectionBlock from "ui/linesSelection";

let pyramidRows = pyramidSettings.rows;

(async () => {
  const application = new Application();
  const engine = new Engine();

  await application.initWorld();
  await application.loadAssets();

  application.injectIntoDOM();
  application.initResizeListener();

  engine.initRunner();

  const { width, height } = application.getDimensions();

  let pyramid = new Pyramid(
    engine.self,
    application.self,
    8,
    width / 2,
    height / 2 - height / 4,
    5,
    35
  );

  const autoCreatePlayBall = (bets: number): void => {
    for (let i = 0; i < bets; i++) {
      setTimeout(() => createPlayBall(), i * 1000);
    }
  };

  const createPlayBall = (): PlayBall | null => {
    if (balance.score < balance.bet) return null;
    balance.score -= balance.bet;
    const ball = new PlayBall(
      engine.self,
      application.self,
      15,
      getRandomColor()
    );
    playBalls.push(ball);
    return ball;
  };

  window.addEventListener("resize", () => {
    application.self.renderer.resize(window.innerWidth, window.innerHeight);
  });

  const playButton = PixiSprite.from("playButtonActiveTexture");
  playButton.anchor.set(0.5);
  playButton.x = width / 2;
  playButton.y = height / 2 + height / 3.5;

  playButton.interactive = true;

  playButton.on("pointerover", () => {
    playButton.texture = PixiTexture.from("playButtonUnactiveTexture");
  });

  playButton.on("pointerout", () => {
    playButton.texture = PixiTexture.from("playButtonActiveTexture");
  });

  playButton.on("pointerdown", () => {
    playButton.scale = 1.1;

    playMode.manual
      ? createPlayBall()
      : autoCreatePlayBall(
          (autoPlayModeState.actualValue = autoPlayModeState.value)
        );
  });

  playButton.on("pointerup", () => {
    playButton.scale = 1;
  });

  application.self.stage.addChild(playButton);

  let betText = new PixiText(`Bet ${balance.bet.toString()} $`, {
    fontSize: 40,
    fill: 0xffffff,
    fontWeight: "bold",
    align: "center",
  });
  betText.anchor.set(0.5);
  betText.x = playButton.x;
  betText.y = playButton.y + playButton.height / 1.5;

  application.self.stage.addChild(betText);

  const plusBetButton = PixiSprite.from("plusBetButtoActiveTexture");
  plusBetButton.interactive = true;
  plusBetButton.anchor.set(0.5);
  plusBetButton.x = betText.x + betText.width;
  plusBetButton.y = betText.y;

  plusBetButton.on("pointerdown", () => {
    if (balance.bet >= settings.maxBet)
      return (plusBetButton.texture = PixiTexture.from(
        "plusBetButtonUnactiveTexture"
      ));

    balance.bet += settings.betStep;

    if (balance.bet > settings.minBet) {
      minBetButton.texture = PixiTexture.from("minBetButtonActiveTexture");
      minusBetButton.texture = PixiTexture.from("minusBetButtonActiveTexture");
    }
  });

  application.self.stage.addChild(plusBetButton);

  const minusBetButton = PixiSprite.from("minusBetButtonActiveTexture");
  minusBetButton.interactive = true;
  minusBetButton.anchor.set(0.5);
  minusBetButton.x = betText.x - betText.width;
  minusBetButton.y = betText.y;

  minusBetButton.on("pointerdown", () => {
    if (balance.bet <= settings.minBet)
      return (minusBetButton.texture = PixiTexture.from(
        "minusBetButtonUnactiveTexture"
      ));

    balance.bet -= settings.betStep;

    if (balance.bet < settings.maxBet) {
      maxBetButton.texture = PixiTexture.from("maxBetButtonActiveTexture");
      plusBetButton.texture = PixiTexture.from("plusBetButtoActiveTexture");
    }
  });

  application.self.stage.addChild(minusBetButton);

  const maxBetButton = PixiSprite.from("maxBetButtonActiveTexture");
  maxBetButton.interactive = true;
  maxBetButton.anchor.set(0.5);
  maxBetButton.x =
    plusBetButton.x + plusBetButton.width + plusBetButton.width / 3;
  maxBetButton.y = plusBetButton.y;

  maxBetButton.on("pointerdown", () => {
    plusBetButton.texture = PixiTexture.from("plusBetButtonUnactiveTexture");
    maxBetButton.texture = PixiTexture.from("maxBetButtonBlockedTexture");
    balance.bet = settings.maxBet;

    minBetButton.texture = PixiTexture.from("minBetButtonActiveTexture");
    minusBetButton.texture = PixiTexture.from("minusBetButtonActiveTexture");
  });

  application.self.stage.addChild(maxBetButton);

  const minBetButton = PixiSprite.from("minBetButtonActiveTexture");
  minBetButton.interactive = true;
  minBetButton.anchor.set(0.5);
  minBetButton.x =
    minusBetButton.x - minusBetButton.width - minusBetButton.width / 3;
  minBetButton.y = minusBetButton.y;

  minBetButton.on("pointerdown", () => {
    minusBetButton.texture = PixiTexture.from("minusBetButtonUnactiveTexture");
    minBetButton.texture = PixiTexture.from("minBetButtonBlockedTexture");
    balance.bet = settings.minBet;

    maxBetButton.texture = PixiTexture.from("maxBetButtonActiveTexture");
    plusBetButton.texture = PixiTexture.from("plusBetButtoActiveTexture");
  });

  application.self.stage.addChild(minBetButton);

  const manualModeButton = PixiSprite.from("manualModeButtonActiveTexture");
  manualModeButton.interactive = true;
  manualModeButton.anchor.set(0.5);
  manualModeButton.scale = 0.7;
  manualModeButton.x = playButton.x + playButton.width;
  manualModeButton.y = playButton.y - playButton.height / 2.5;

  manualModeButton.on("pointerdown", () => {
    if (playMode.manual) return;

    playMode.manual = true;
    playMode.auto = false;
    manualModeButton.texture = PixiTexture.from(
      "manualModeButtonActiveTexture"
    );
    autoModeButton.texture = PixiTexture.from("autoModeButtonUnactiveTexture");

    autoModeCounter.visible = false;
  });

  application.self.stage.addChild(manualModeButton);

  const autoModeButton = PixiSprite.from("autoModeButtonUnactiveTexture");
  autoModeButton.interactive = true;
  autoModeButton.anchor.set(0.5);
  autoModeButton.scale = 0.7;
  autoModeButton.x = manualModeButton.x;
  autoModeButton.y = manualModeButton.y + manualModeButton.height;

  autoModeButton.on("pointerdown", () => {
    if (
      manualModeButton.texture ===
      PixiTexture.from("manualModeButtonUnactiveTexture")
    )
      return;

    playMode.manual = false;
    playMode.auto = true;
    autoModeButton.texture = PixiTexture.from("autoModeButtonActiveTexture");
    manualModeButton.texture = PixiTexture.from(
      "manualModeButtonUnactiveTexture"
    );

    autoModeCounter.visible = true;
  });

  application.self.stage.addChild(autoModeButton);

  const balanceText = new PixiText(`Balance ${balance.score.toString()} $`, {
    fontSize: 40,
    fill: 0xffffff,
    fontWeight: "bold",
    align: "center",
  });
  balanceText.anchor.set(0.5);
  balanceText.x = betText.x;
  balanceText.y = betText.y + betText.height * 1.5;

  application.self.stage.addChild(balanceText);

  const autoModeCounter = new CounterBlock(
    autoModeButton.x + autoModeButton.width,
    autoModeButton.y,
    autoPlayModeState.actualValue
  );
  autoModeCounter.visible = false;

  application.self.stage.addChild(autoModeCounter);

  const linesSelection = new LinesSelectionBlock(
    pyramid.getPosition().x + pyramid.getDimensions().width,
    pyramid.getPosition().y - pyramid.getDimensions().height / 4
  );

  application.self.stage.addChild(linesSelection);

  const table = new Table(100, 100);

  application.self.stage.addChild(table);

  application.self.ticker.add(() => {
    engine.update();

    playBalls.forEach((ball) => ball.update());

    betText.text = `Bet ${balance.bet.toString()} $`;
    balanceText.text = `Balance ${balance.score.toString()} $`;

    if (pyramidRows !== pyramidSettings.rows) {
      pyramidRows = pyramidSettings.rows;

      pyramid.destroy();
      pyramid = new Pyramid(
        engine.self,
        application.self,
        pyramidSettings.rows,
        width / 2,
        height / 2 - height / 4,
        5,
        35
      );
    }

    table.update();
  });
})();
