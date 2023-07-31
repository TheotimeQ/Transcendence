export type Round = {
  left: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  right: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

export type ScoreInfo = {
  id: string;
  leftRound: 0 | 1 | 2 | 3 | 4 | 5;
  rightRound: 0 | 1 | 2 | 3 | 4 | 5;
  round: Round[];
};
