import * as PIXI from "pixi.js";
import { autoPlayModeState } from "../../constants/index";

export default class CounterBlock extends PIXI.Container {
  private value: number;
  private text: PIXI.Text;
  private plusButton: PIXI.Graphics;
  private minusButton: PIXI.Graphics;
  private plusText: PIXI.Text;
  private minusText: PIXI.Text;

  constructor(x: number, y: number, value: number) {
    super();

    this.x = x;
    this.y = y;
    this.value = value;

    this.text = new PIXI.Text(this.value.toString(), {
      fontSize: 24,
      fill: 0xffffff,
    });
    this.text.anchor.set(0.5);
    this.text.position.set(65, 0);
    this.addChild(this.text);

    this.plusButton = new PIXI.Graphics();
    this.plusButton.fill(0xd75d5d);
    this.plusButton.rect(0, 0, 30, 30);
    this.plusButton.endFill();
    this.plusButton.interactive = true;
    this.plusButton.position.set(100, -15);
    this.plusButton.on("pointerdown", this.increment.bind(this));
    this.addChild(this.plusButton);

    this.plusText = new PIXI.Text("+", { fontSize: 24, fill: 0xffffff });
    this.plusText.anchor.set(0.5);
    this.plusText.position.set(15, 15);
    this.plusButton.addChild(this.plusText);

    this.minusButton = new PIXI.Graphics();
    this.minusButton.fill(0xd75d5d);
    this.minusButton.rect(0, 0, 30, 30);
    this.minusButton.endFill();
    this.minusButton.interactive = true;
    this.minusButton.position.set(0, -15);
    this.minusButton.on("pointerdown", this.decrement.bind(this));
    this.addChild(this.minusButton);

    this.minusText = new PIXI.Text("-", { fontSize: 24, fill: 0xffffff });
    this.minusText.anchor.set(0.5);
    this.minusText.position.set(15, 15);
    this.minusButton.addChild(this.minusText);
  }

  private increment(): void {
    if (autoPlayModeState.value < 100) {
      autoPlayModeState.value += 5;
      if (autoPlayModeState.value > 100) autoPlayModeState.value = 100;
      this.updateText();
    }
  }

  private decrement(): void {
    if (autoPlayModeState.value > 5) {
      autoPlayModeState.value -= 5;
      if (autoPlayModeState.value < 5) autoPlayModeState.value = 5;
      this.updateText();
    }
  }

  private updateText(): void {
    this.text.text = autoPlayModeState.value.toString();
  }
}
