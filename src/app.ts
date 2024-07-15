import * as Pixi from "pixi.js";
import Matter from "matter-js";
import PlayBall from "./entities/playball";
import getRandomColor from "./helpers/getRandomColor";
import { Pyramid } from "./entities/pyramid";
import {
  autoPlayModeState,
  balance,
  playBalls,
  playMode,
  pyramidSettings,
  settings,
} from "./constants/index";
import Table from "./ui/table";
import CounterBlock from "./ui/autoModeSelection";
import LinesSelectionBlock from "./ui/linesSelection";

let pyramidRows = pyramidSettings.rows;

(async () => {
  const app = new Pixi.Application();
  await app.init({
    antialias: true,
    background: "#1099bb",
    resizeTo: window,
  });
  document.body.appendChild(app.canvas);

  const playButtonActiveTexture = await Pixi.Assets.load(
    "./assets/svg/play_button_unactive.svg"
  );
  const playButtonUnactiveTexture = await Pixi.Assets.load(
    "./assets/svg/play_button_active.svg"
  );

  const plusBetButtoActiveTexture = await Pixi.Assets.load(
    "./assets/svg/plus_button_active.svg"
  );

  const plusBetButtonUnactiveTexture = await Pixi.Assets.load(
    "./assets/svg/plus_button_unactive.svg"
  );

  const minusBetButtonActiveTexture = await Pixi.Assets.load(
    "./assets/svg/minus_button_active.svg"
  );

  const minusBetButtonUnactiveTexture = await Pixi.Assets.load(
    "./assets/svg/minus_button_unactive.svg"
  );

  const maxBetButtonActiveTexture = await Pixi.Assets.load(
    "./assets/svg/max_button_active.svg"
  );

  const maxBetButtonBlockedTexture = await Pixi.Assets.load(
    "./assets/svg/max_button_blocked.svg"
  );

  const minBetButtonActiveTexture = await Pixi.Assets.load(
    "./assets/svg/min_button_active.svg"
  );
  const minBetButtonBlockedTexture = await Pixi.Assets.load(
    "./assets/svg/min_button_blocked.svg"
  );

  const manualModeButtonActiveTexture = await Pixi.Assets.load(
    "./assets/svg/manual_selection_active.svg"
  );
  const manualModeButtonUnactiveTexture = await Pixi.Assets.load(
    "./assets/svg/manual_selection_unactive.svg"
  );

  const autoModeButtonActiveTexture = await Pixi.Assets.load(
    "./assets/svg/automatic_selection_active.svg"
  );

  const autoModeButtonUnactiveTexture = await Pixi.Assets.load(
    "./assets/svg/automatic_selection_unactive.svg"
  );

  const MatterEngine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

  const engine = MatterEngine.create();
  const world = engine.world;
  world.gravity.y = 0.4;
  const runner = Runner.create();
  Matter.Runner.run(runner, engine);
  const renderConfig = Render.create({
    engine: engine,
    options: {
      width: app.screen.width,
      height: app.screen.height,
      wireframes: true,
    },
  });

  Render.run(renderConfig);

  const matterGround = Bodies.rectangle(
    app.screen.width / 2,
    app.screen.height,
    app.screen.width,
    50,
    { isStatic: true }
  );

  Composite.add(world, [matterGround]);

  let pyramid = new Pyramid(
    engine,
    app,
    8,
    app.screen.width / 2,
    app.screen.height / 2 - app.screen.height / 4,
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
    const ball = new PlayBall(engine, app, 15, getRandomColor());
    playBalls.push(ball);
    return ball;
  };

  // window size update
  window.addEventListener("resize", () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    Matter.Body.setPosition(matterGround, {
      x: app.screen.width / 2,
      y: app.screen.height + 25,
    });
  });

  //UI

  const playButton = new Pixi.Sprite(playButtonActiveTexture);
  playButton.anchor.set(0.5);
  playButton.x = app.screen.width / 2;
  playButton.y = app.screen.height / 2 + app.screen.height / 3.5;

  playButton.interactive = true;

  playButton.on("pointerover", () => {
    playButton.texture = playButtonUnactiveTexture;
  });

  playButton.on("pointerout", () => {
    playButton.texture = playButtonActiveTexture;
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

  app.stage.addChild(playButton);

  let betText = new Pixi.Text(`Bet ${balance.bet.toString()} $`, {
    fontSize: 40,
    fill: 0xffffff,
    fontWeight: "bold",
    align: "center",
  });
  betText.anchor.set(0.5);
  betText.x = playButton.x;
  betText.y = playButton.y + playButton.height / 1.5;

  app.stage.addChild(betText);

  const plusBetButton = new Pixi.Sprite(plusBetButtoActiveTexture);
  plusBetButton.interactive = true;
  plusBetButton.anchor.set(0.5);
  plusBetButton.x = betText.x + betText.width;
  plusBetButton.y = betText.y;

  plusBetButton.on("pointerdown", () => {
    if (balance.bet >= settings.maxBet)
      return (plusBetButton.texture = plusBetButtonUnactiveTexture);

    balance.bet += settings.betStep;

    if (balance.bet > settings.minBet) {
      minBetButton.texture = minBetButtonActiveTexture;
      minusBetButton.texture = minusBetButtonActiveTexture;
    }
  });

  app.stage.addChild(plusBetButton);

  const minusBetButton = new Pixi.Sprite(minusBetButtonActiveTexture);
  minusBetButton.interactive = true;
  minusBetButton.anchor.set(0.5);
  minusBetButton.x = betText.x - betText.width;
  minusBetButton.y = betText.y;

  minusBetButton.on("pointerdown", () => {
    if (balance.bet <= settings.minBet)
      return (minusBetButton.texture = minusBetButtonUnactiveTexture);

    balance.bet -= settings.betStep;

    if (balance.bet < settings.maxBet) {
      maxBetButton.texture = maxBetButtonActiveTexture;
      plusBetButton.texture = plusBetButtoActiveTexture;
    }
  });

  app.stage.addChild(minusBetButton);

  const maxBetButton = new Pixi.Sprite(maxBetButtonActiveTexture);
  maxBetButton.interactive = true;
  maxBetButton.anchor.set(0.5);
  maxBetButton.x =
    plusBetButton.x + plusBetButton.width + plusBetButton.width / 3;
  maxBetButton.y = plusBetButton.y;

  maxBetButton.on("pointerdown", () => {
    plusBetButton.texture = plusBetButtonUnactiveTexture;
    maxBetButton.texture = maxBetButtonBlockedTexture;
    balance.bet = settings.maxBet;

    minBetButton.texture = minBetButtonActiveTexture;
    minusBetButton.texture = minusBetButtonActiveTexture;
  });

  app.stage.addChild(maxBetButton);

  const minBetButton = new Pixi.Sprite(minBetButtonActiveTexture);
  minBetButton.interactive = true;
  minBetButton.anchor.set(0.5);
  minBetButton.x =
    minusBetButton.x - minusBetButton.width - minusBetButton.width / 3;
  minBetButton.y = minusBetButton.y;

  minBetButton.on("pointerdown", () => {
    minusBetButton.texture = minusBetButtonUnactiveTexture;
    minBetButton.texture = minBetButtonBlockedTexture;
    balance.bet = settings.minBet;

    maxBetButton.texture = maxBetButtonActiveTexture;
    plusBetButton.texture = plusBetButtoActiveTexture;
  });

  app.stage.addChild(minBetButton);

  const manualModeButton = new Pixi.Sprite(manualModeButtonActiveTexture);
  manualModeButton.interactive = true;
  manualModeButton.anchor.set(0.5);
  manualModeButton.scale = 0.7;
  manualModeButton.x = playButton.x + playButton.width;
  manualModeButton.y = playButton.y - playButton.height / 2.5;

  manualModeButton.on("pointerdown", () => {
    if (playMode.manual) return;

    playMode.manual = true;
    playMode.auto = false;
    manualModeButton.texture = manualModeButtonActiveTexture;
    autoModeButton.texture = autoModeButtonUnactiveTexture;

    autoModeCounter.visible = false;
  });

  app.stage.addChild(manualModeButton);

  const autoModeButton = new Pixi.Sprite(autoModeButtonUnactiveTexture);
  autoModeButton.interactive = true;
  autoModeButton.anchor.set(0.5);
  autoModeButton.scale = 0.7;
  autoModeButton.x = manualModeButton.x;
  autoModeButton.y = manualModeButton.y + manualModeButton.height;

  autoModeButton.on("pointerdown", () => {
    if (manualModeButton.texture === manualModeButtonUnactiveTexture) return;

    playMode.manual = false;
    playMode.auto = true;
    autoModeButton.texture = autoModeButtonActiveTexture;
    manualModeButton.texture = manualModeButtonUnactiveTexture;

    autoModeCounter.visible = true;
  });

  app.stage.addChild(autoModeButton);

  const balanceText = new Pixi.Text(`Balance ${balance.score.toString()} $`, {
    fontSize: 40,
    fill: 0xffffff,
    fontWeight: "bold",
    align: "center",
  });
  balanceText.anchor.set(0.5);
  balanceText.x = betText.x;
  balanceText.y = betText.y + betText.height * 1.5;

  app.stage.addChild(balanceText);

  const autoModeCounter = new CounterBlock(
    autoModeButton.x + autoModeButton.width,
    autoModeButton.y,
    autoPlayModeState.actualValue
  );
  autoModeCounter.visible = false;

  app.stage.addChild(autoModeCounter);

  const linesSelection = new LinesSelectionBlock(
    pyramid.getPosition().x + pyramid.getDimensions().width,
    pyramid.getPosition().y - pyramid.getDimensions().height / 4
  );

  app.stage.addChild(linesSelection);

  const table = new Table(100, 100);

  app.stage.addChild(table);

  app.ticker.add(() => {
    MatterEngine.update(engine);

    playBalls.forEach((ball) => ball.update());

    betText.text = `Bet ${balance.bet.toString()} $`;
    balanceText.text = `Balance ${balance.score.toString()} $`;

    if (pyramidRows !== pyramidSettings.rows) {
      pyramidRows = pyramidSettings.rows;

      pyramid.destroy();
      pyramid = new Pyramid(
        engine,
        app,
        pyramidSettings.rows,
        app.screen.width / 2,
        app.screen.height / 2 - app.screen.height / 4,
        5,
        35
      );
    }

    table.update();
  });
})();
