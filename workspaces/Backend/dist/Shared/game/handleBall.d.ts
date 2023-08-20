import { GameData, Ball, PlayerDynamic } from "@transcendence/shared/types/Game.types";
export declare function resetBall(ball: Ball, game: GameData): void;
export declare function handlePush(ball: Ball, player: PlayerDynamic): void;
export declare function calculateBallAngle(ball: Ball, posY: number, height: number): number;
export declare function handlePlayerCollision(ball: Ball, player: PlayerDynamic, playerSide: "Left" | "Right"): void;
export declare function updateBall(ball: Ball, game: GameData): string;
export declare function handleServe(ball: Ball, game: GameData): void;
