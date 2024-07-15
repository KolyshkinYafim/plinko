import * as Pixi from "pixi.js";
import Ball from "../ball";
import Matter from "matter-js";
import { spawnPosition } from "../../constants";
import Basket from "../basket/index";

export class Pyramid {
  private balls: Ball[] = [];
  private baskets: Basket[] = [];
  private spawn: Pixi.Sprite | null = null;
  private x: number;
  private y: number;
  private rows: number;
  private radius: number;
  private spacing: number;

  constructor(
    engine: Matter.Engine,
    app: Pixi.Application,
    rows: number,
    x: number,
    y: number,
    radius: number,
    spacing: number
  ) {
    this.x = x;
    this.y = y;
    this.rows = rows;
    this.radius = radius;
    this.spacing = spacing;

    this.create(engine, app);
  }

  public create(engine: Matter.Engine, app: Pixi.Application) {
    this.balls = [];
    this.spawn = null;

    const { Composite } = Matter;

    Pixi.Assets.load("../../assets/svg/playball_hole.svg").then((res) => {
      this.spawn = Pixi.Sprite.from(res);
      this.spawn.anchor.set(0.5);
      this.spawn.x = this.x;
      this.spawn.y = this.y - this.radius - this.spacing * 2;
      this.spawn.scale = 0.4;
      spawnPosition.x = this.spawn.x;
      spawnPosition.y = this.spawn.y;

      app.stage.addChild(this.spawn);
    });

    for (let row: number = 0; row < this.rows; row++) {
      const numBalls = 3 + row;

      const ballY = this.y + row * (this.radius * 2 + this.spacing);

      for (let col: number = 0; col < numBalls; col++) {
        const ballX =
          this.x +
          (col - (numBalls - 1) / 2) * (this.radius * 2 + this.spacing);

        const ball = new Ball(engine, app, ballX, ballY, this.radius, "white");
        this.balls.push(ball);

        Composite.add(engine.world, ball.getBody());
      }

      if (row === this.rows - 1) {
        let coef: number = Math.floor(numBalls / 2.5);
        const basketSpacing = (this.radius + this.spacing) * 1.15;
        const startX =
          this.x - (numBalls / 2) * basketSpacing + basketSpacing / 2 + 10;

        for (let i = 0; i <= this.rows; i++) {
          const basketX = startX + i * basketSpacing;
          const basketY =
            this.y + (this.radius * 1.6 + this.spacing) * this.rows;

          const basket = new Basket(
            engine,
            app,
            basketX,
            basketY,
            30,
            15,
            Math.pow(2, i <= this.rows / 2 ? --coef : ++coef)
          );
          this.baskets.push(basket);
        }
      }
    }
  }

  public getPosition() {
    return { x: this.x, y: this.y };
  }

  public destroy() {
    this.balls.forEach((ball) => {
      ball.destroy();
    });
    this.balls = [];

    this.baskets.forEach((basket) => {
      basket.destroy();
    });
    this.baskets = [];

    if (this.spawn) {
      this.spawn.destroy();
      this.spawn = null;
    }
  }

  public getDimensions() {
    const width = (3 + this.rows - 1) * (this.radius * 2 + this.spacing);
    const height =
      this.rows * (this.radius * 2 + this.spacing) +
      (this.radius * 2 + this.spacing) * 7.5;

    return { width, height };
  }
}
