import {
  Text as PixiText,
  Graphics as PixiGraphics,
  Container as PixiContainer,
} from "pixi.js";
import { autoPlayModeState } from "constants/index";

export default class CounterBlock extends PixiContainer {
  private value: number;
  private text: PixiText;
  private plusButton: PixiGraphics;
  private minusButton: PixiGraphics;
  private plusText: PixiText;
  private minusText: PixiText;

  constructor(x: number, y: number, value: number) {
    super();

    this.x = x;
    this.y = y;
    this.value = value;

    this.text = new PixiText(this.value.toString(), {
      fontSize: 24,
      fill: 0xffffff,
    });
    this.text.anchor.set(0.5);
    this.text.position.set(65, 0);
    this.addChild(this.text);

    this.plusButton = new PixiGraphics();
    this.plusButton.fill(0xd75d5d);
    this.plusButton.rect(0, 0, 30, 30);
    this.plusButton.endFill();
    this.plusButton.interactive = true;
    this.plusButton.position.set(100, -15);
    this.plusButton.on("pointerdown", this.increment.bind(this));
    this.addChild(this.plusButton);

    this.plusText = new PixiText("+", { fontSize: 24, fill: 0xffffff });
    this.plusText.anchor.set(0.5);
    this.plusText.position.set(15, 15);
    this.plusButton.addChild(this.plusText);

    this.minusButton = new PixiGraphics();
    this.minusButton.fill(0xd75d5d);
    this.minusButton.rect(0, 0, 30, 30);
    this.minusButton.endFill();
    this.minusButton.interactive = true;
    this.minusButton.position.set(0, -15);
    this.minusButton.on("pointerdown", this.decrement.bind(this));
    this.addChild(this.minusButton);

    this.minusText = new PixiText("-", { fontSize: 24, fill: 0xffffff });
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
