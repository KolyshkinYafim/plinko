import { Application as PixiApplication, Assets as PixiAssets } from "pixi.js";
import assetsMap from "constants/assetsMap";

export default class Application extends PixiApplication {
  private app: PixiApplication;

  constructor() {
    super();
    this.app = new PixiApplication();
  }

  get self() {
    return this.app;
  }

  public getDimensions() {
    return { width: this.app.screen.width, height: this.app.screen.height };
  }
  public async initWorld() {
    await this.app.init({
      antialias: true,
      background: "#1099bb",
      resizeTo: window,
    });
  }

  public injectIntoDOM() {
    document.body.appendChild(this.app.canvas);
  }

  public initResizeListener() {
    window.addEventListener("resize", () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }

  public async loadAssets() {
    await Promise.all(
      assetsMap.map(({ name, url }) => {
        PixiAssets.add({ alias: name, src: url });

        return PixiAssets.load(name);
      })
    );
  }
}
