import * as Pixi from "pixi.js";
import Matter from "matter-js";
import generateRandomDirection from "../../helpers/generateRandomDirection";

export default class Ball {
  private body: Matter.Body;
  private graphics: Pixi.Graphics;
  private app: Pixi.Application;
  private isAnimating: boolean = false;
  private engine: Matter.Engine;

  constructor(
    engine: Matter.Engine,
    app: Pixi.Application,
    x: number,
    y: number,
    radius: number,
    color: string
  ) {
    this.engine = engine;
    this.app = app;

    const { Bodies, Composite, Events } = Matter;

    this.body = Bodies.circle(x, y, radius, {
      isStatic: true,
      label: "ball",
      restitution: 0.8,
      friction: 0,
      frictionAir: 0,
      density: 1,
    });

    Composite.add(engine.world, this.body);

    this.graphics = new Pixi.Graphics()
      .fill(color)
      .circle(0, 0, radius)
      .endFill();

    this.graphics.x = x;
    this.graphics.y = y;

    app.stage.addChild(this.graphics);

    Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs;

      pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if (
          (bodyA === this.body && bodyB.label === "playBall") ||
          (bodyB === this.body && bodyA.label === "playBall")
        ) {
          this.handleCollision(bodyA === this.body ? bodyB : bodyA);
        }
      });
    });
  }

  private handleCollision(otherBody: Matter.Body) {
    if (otherBody.label === "playBall") {
      this.startAnimation();

      const direction = generateRandomDirection();
      const speed = 1 + Math.random() * 2;

      const angle = direction * (Math.PI / 4);

      otherBody.velocity.x = Math.cos(angle) * speed;
      otherBody.velocity.y = Math.sin(angle) * speed;
    }
  }

  private startAnimation() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const originalScale = this.graphics.scale.x;
    const maxScale = originalScale * 1.3;
    const animationSpeed = 0.07;
    let scaleDirection = 1;

    const animate = () => {
      this.graphics.scale.x += animationSpeed * scaleDirection;
      this.graphics.scale.y += animationSpeed * scaleDirection;

      if (this.graphics.scale.x >= maxScale) {
        scaleDirection = -1;
      }

      if (scaleDirection === -1 && this.graphics.scale.x <= originalScale) {
        this.graphics.scale.x = originalScale;
        this.graphics.scale.y = originalScale;
        this.isAnimating = false;
        Pixi.Ticker.shared.remove(animate);
      }
    };

    Pixi.Ticker.shared.add(animate);
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

    if (this.body) Composite.remove(this.engine.world, this.body, true);

    this.app = null as any;
    this.engine = null as any;
    this.body = null as any;
    this.graphics = null as any;
  }
}
