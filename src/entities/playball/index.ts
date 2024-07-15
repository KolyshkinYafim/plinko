import * as Pixi from "pixi.js";
import Matter from "matter-js";
import { spawnPosition } from "../../constants";
import generateRandomDirection from "../../helpers/generateRandomDirection";

export default class PlayBall {
  private body: Matter.Body;
  private graphics: Pixi.Graphics;
  private engine: Matter.Engine;
  private app: Pixi.Application;

  constructor(
    engine: Matter.Engine,
    app: Pixi.Application,
    radius: number,
    color: number
  ) {
    this.app = app;
    this.engine = engine;
    const { Bodies, Composite } = Matter;

    this.body = Bodies.circle(
      spawnPosition.x + generateRandomDirection(),
      spawnPosition.y,
      radius,
      {
        isStatic: false,
        isSensor: false,
        label: "playBall",
        restitution: 0.8,
        friction: 0.01,
        frictionAir: 0.03,
        density: 1,
      }
    );
    Composite.add(engine.world, this.body);

    this.graphics = new Pixi.Graphics()
      .fill(color)
      .circle(0, 0, radius)
      .endFill();

    app.stage.addChild(this.graphics);
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

  public getBodyAngle() {
    return this.body.angle;
  }

  public setBodyAngle(angle: number) {
    this.body.angle = angle;
  }

  public destroy() {
    const { Composite } = Matter;

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
