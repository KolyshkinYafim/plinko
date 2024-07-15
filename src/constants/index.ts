import PlayBall from "entities/playball";

export const spawnPosition: { x: number; y: number } = { x: 0, y: 0 };
export const balance: { score: number; bet: number } = { score: 1000, bet: 10 };

export const settings: Readonly<{
  maxBet: number;
  minBet: number;
  betStep: number;
}> = Object.freeze({
  maxBet: 100,
  minBet: 5,
  betStep: 5,
});

export const playBalls: PlayBall[] = [];

export const playMode: { manual: boolean; auto: boolean } = {
  manual: true,
  auto: false,
};

export const autoPlayModeState: {
  value: number;
  actualValue: number;
  gameStatus: boolean;
} = {
  value: 10,
  actualValue: 10,
  gameStatus: false,
};

export const riskMode: { high: boolean; medium: boolean; low: boolean } = {
  high: false,
  medium: false,
  low: true,
};

export const betsList: {
  time: string;
  bet: number;
  payout: string;
  profit: number;
}[] = [];

export const pyramidSettings: { rows: number } = { rows: 8 };
