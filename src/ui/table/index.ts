import { Text as PixiText, Container as PixiContainer } from "pixi.js";
import { betsList } from "constants/index";

export default class Table extends PixiContainer {
  private headers: PixiText[];
  private dataRows: PixiText[];
  private columnWidth: number[];
  private headerHeight: number;
  private rowHeight: number;
  private headerTexts: string[];

  constructor(x: number, y: number) {
    super();

    this.x = x;
    this.y = y;

    this.headerTexts = ["Time", "Bet", "Payout", "Profit"];
    this.columnWidth = [100, 50, 70, 70];
    this.headerHeight = 30;
    this.rowHeight = 20;

    this.headers = [];
    this.dataRows = [];

    this.headerTexts.forEach((text, index) => {
      const header = new PixiText(text, {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xffffff,
        align: "center",
      });
      header.anchor.set(0.5);
      header.x =
        this.columnWidth.slice(0, index).reduce((a, b) => a + b, 0) +
        this.columnWidth[index] / 2;
      header.y = this.headerHeight / 2;
      this.headers.push(header);
      this.addChild(header);
    });

    this.update();
  }

  public update() {
    if (!this.dataRows) return;

    this.dataRows.forEach((row) => row.destroy());
    this.dataRows = [];
    betsList.forEach((entry, index) => {
      const rowTexts = [
        entry.time.toString(),
        entry.bet.toString(),
        entry.payout,
        entry.profit >= entry.bet
          ? `+${entry.profit}`
          : `-${entry.bet - entry.profit}`,
      ];

      rowTexts.forEach((text, colIndex) => {
        const rowText = new PixiText(text, {
          fontFamily: "Arial",
          fontSize: 14,
          fill: 0xffffff,
          align: "center",
        });
        rowText.anchor.set(0.5);
        rowText.x =
          this.columnWidth.slice(0, colIndex).reduce((a, b) => a + b, 0) +
          this.columnWidth[colIndex] / 2;
        rowText.y =
          this.headerHeight + (index + 1) * this.rowHeight - this.rowHeight / 2;
        this.dataRows.push(rowText);
        this.addChild(rowText);
      });
    });
  }
}
