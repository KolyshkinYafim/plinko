import {
  Engine as MatterEngine,
  World as MatterWorld,
  Runner as MatterRunner,
} from "matter-js";

export default class Engine {
  private engine: MatterEngine = MatterEngine.create();
  public readonly world: MatterWorld = this.engine.world;

  constructor() {
    this.world.gravity.y = 0.4;
  }

  get self() {
    return this.engine;
  }

  public update() {
    MatterEngine.update(this.engine);
  }

  public initRunner() {
    MatterRunner.run(MatterRunner.create(), this.engine);
  }
}
