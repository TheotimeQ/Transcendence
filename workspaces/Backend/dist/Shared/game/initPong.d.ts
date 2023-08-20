import { InitData, GameData, Ball, Player, PlayerDynamic } from "@transcendence/shared/types/Game.types";
export declare function initPlayerDynamic(side: "Left" | "Right", difficulty: -2 | -1 | 0 | 1 | 2, actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): PlayerDynamic;
export declare function initBall(difficulty: -2 | -1 | 0 | 1 | 2, actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): Ball;
export declare function initPlayer(side: "Left" | "Right"): Player;
export declare function initPong(initData: InitData): GameData;
