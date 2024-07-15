import {
  Graphics as PixiGraphics,
  Text as PixiText,
  Container as PixiContainer,
} from "pixi.js";
import { pyramidSettings } from "constants/index";

export default class LinesSelectionBlock extends PixiContainer {
  private buttons: PixiGraphics[];
  private activeButton: PixiGraphics | null;

  constructor(x: number, y: number) {
    super();

    this.x = x;
    this.y = y;

    const titleText = new PixiText("Lines", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    });
    titleText.anchor.set(0.5);
    titleText.x = 0;
    titleText.y = 20;
    this.addChild(titleText);

    const buttonTexts = [8, 9, 10];
    const buttonWidth = 60;
    const buttonHeight = 20;
    const buttonMargin = 10;

    this.buttons = [];
    this.activeButton = null;

    buttonTexts.forEach((text, index) => {
      const button = new PixiGraphics();
      button.fill(0xd75d5d).rect(0, 0, buttonWidth, buttonHeight).endFill();
      button.interactive = true;

      button.x = -buttonWidth / 2;
      button.y = 60 + (buttonHeight + buttonMargin) * index;

      const buttonText = new PixiText(text, {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xffffff,
        align: "center",
      });
      buttonText.anchor.set(0.5);
      buttonText.x = buttonWidth / 2;
      buttonText.y = buttonHeight / 2;

      button.addChild(buttonText);

      button.on("pointerdown", () => this.setActiveButton(button));

      this.buttons.push(button);
      this.addChild(button);
    });

    if (this.buttons.length > 0) {
      this.setActiveButton(this.buttons[0]);
    }
  }

  private setActiveButton(button: PixiGraphics) {
    if (this.activeButton) {
      this.activeButton.clear();
      this.activeButton.beginFill(0xd75d5d);
      this.activeButton.drawRect(0, 0, 60, 20);
      this.activeButton.endFill();
      const buttonText = this.activeButton.getChildAt(0) as PixiText;
      buttonText.style.fill = 0xffffff;
    }

    this.activeButton = button;
    this.activeButton.clear();
    this.activeButton.fill(0xe69a9a).rect(0, 0, 60, 20).endFill();
    const activeButtonText = this.activeButton.getChildAt(0) as PixiText;
    activeButtonText.style.fill = 0xffffff;
    const selectedRow = parseInt(activeButtonText.text, 10);
    pyramidSettings.rows = selectedRow;
  }
}
