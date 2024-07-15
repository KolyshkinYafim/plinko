import * as Pixi from "pixi.js";
import Matter from "matter-js";
import { balance, betsList, playBalls } from "../../constants";
import PlayBall from "entities/playball";
import formatDate from "../../helpers/formatDate";

export default class Basket {
  private body: Matter.Body;
  private graphics: Pixi.Graphics;
  private scoreText: Pixi.Text;
  private app: Pixi.Application;
  private engine: Matter.Engine;
  private score: number;

  constructor(
    engine: Matter.Engine,
    app: Pixi.Application,
    posX: number,
    posY: number,
    width: number,
    height: number,
    score: number
  ) {
    this.app = app;
    this.engine = engine;
    this.score = score;

    const { Bodies, Composite, Events } = Matter;

    this.body = Bodies.rectangle(posX, posY, width, height, {
      isStatic: true,
      label: "basket",
      isSensor: false,
    });

    Composite.add(engine.world, this.body);

    this.graphics = new Pixi.Graphics()
      .fill(0x4caf50)
      .rect(posX, posY, width, height)
      .endFill();

    app.stage.addChild(this.graphics);

    this.scoreText = new Pixi.Text(`${score.toString()}x`, {
      fontSize: 12,
      fill: 0xffffff,
      fontWeight: "bold",
      align: "center",
    });
    this.scoreText.anchor.set(0.5);
    this.scoreText.x = posX + this.graphics.width / 2;
    this.scoreText.y = posY + this.graphics.height / 2;
    this.graphics.addChild(this.scoreText);

    Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if (
          (bodyA === this.body && bodyB.label === "playBall") ||
          (bodyB === this.body && bodyA.label === "playBall")
        ) {
          console.log(this.score);
          const playBall = bodyA.label === "playBall" ? bodyA : bodyB;
          this.handleCollision(playBall);
        }
      });
    });
  }

  private handleCollision(otherBody: Matter.Body) {
    const playBall = playBalls.find(
      (ball) => ball.getBody().id === otherBody.id
    );

    if (playBall) {
      playBall.destroy();
      const index = playBalls.indexOf(playBall);
      if (index > -1) {
        playBalls.splice(index, 1);
      }
    }

    betsList.push({
      time: formatDate(),
      bet: balance.bet,
      payout: this.score.toString(),
      profit: balance.bet * this.score,
    });

    balance.score += balance.bet * this.score;
  }

  public update() {
    this.graphics.x = this.body.position.x;
    this.graphics.y = this.body.position.y;
    this.graphics.rotation = this.body.angle;
  }

  public getGraphics() {
    return this.graphics;
  }

  public getBody() {
    return this.body;
  }

  public destroy() {
    const { Events, Composite } = Matter;
    Events.off(this.engine, "collisionStart", this.handleCollision.bind(this));

    if (this.graphics) {
      this.app.stage.removeChild(this.graphics);
      this.graphics.destroy();
    }

    if (this.body) Composite.remove(this.engine.world, this.body);

    this.app = null as any;
    this.engine = null as any;
    this.body = null as any;
    this.graphics = null as any;
  }
}
