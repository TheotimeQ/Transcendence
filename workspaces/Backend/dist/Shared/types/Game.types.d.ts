import { ScoreInfo } from "./Score.types";
export declare enum Action {
    Idle = "Idle",
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right",
    Push = "Push",
    Stop = "Stop"
}
export type DirX = -1 | 0 | 1;
export type DirY = -1 | 0 | 1;
export declare const DirXValues: {
    [key: string]: DirX;
};
export declare const DirYValues: {
    [key: string]: DirY;
};
export type Pause = {
    active: boolean;
    left: number;
    right: number;
    status: "Left" | "Right" | "None";
};
export type Timer = {
    reason: "Start" | "ReStart" | "Round" | "Pause" | "Deconnection";
    end: number;
    playerName?: string;
};
export type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
};
type Avatar = {
    image: string;
    variant: string;
    borderColor: string;
    backgroundColor: string;
    text: string;
    empty: boolean;
    decrypt: boolean;
};
export type Player = {
    id: number;
    name: string;
    color: RGBA;
    avatar: Avatar;
    side: "Left" | "Right";
    host: boolean;
};
export type PlayerDynamic = {
    posX: number;
    posY: number;
    speed: number;
    move: Action;
    push: number;
};
export type Ball = {
    posX: number;
    posY: number;
    speed: number;
    moveX: number;
    moveY: number;
    push: number;
};
export type Draw = {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    backgroundImage: HTMLImageElement;
    ballImage: HTMLImageElement;
};
export type GameData = {
    id: string;
    name: string;
    ball: Ball;
    playerLeft: Player;
    playerRight: Player;
    playerLeftDynamic: PlayerDynamic;
    playerRightDynamic: PlayerDynamic;
    playerLeftStatus: "Unknown" | "Connected" | "Playing" | "Paused" | "Disconnected";
    playerRightStatus: "Unknown" | "Connected" | "Playing" | "Paused" | "Disconnected";
    background: string;
    ballImg: string;
    type: "Classic" | "Best3" | "Best5" | "Custom";
    mode: "League" | "Party" | "Training";
    hostSide: "Left" | "Right";
    difficulty: -2 | -1 | 0 | 1 | 2;
    push: boolean;
    maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxRound: 1 | 3 | 5 | 7 | 9;
    playerServe: "Left" | "Right" | null;
    actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    score: ScoreInfo;
    timer: Timer;
    pause: Pause;
    status: "Not Started" | "Stopped" | "Playing" | "Finished" | "Deleted";
    result: "Not Finished" | "Host" | "Opponent" | "Deleted";
    sendStatus: boolean;
    updateScore: boolean;
};
export type InitData = {
    id: string;
    name: string;
    type: "Classic" | "Best3" | "Best5" | "Custom";
    mode: "League" | "Party" | "Training";
    hostSide: "Left" | "Right";
    actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxRound: 1 | 3 | 5 | 7 | 9;
    difficulty: -2 | -1 | 0 | 1 | 2;
    push: boolean;
    pause: boolean;
    background: string;
    ball: string;
    score: ScoreInfo;
};
export type GameInfo = {
    id: string;
    name: string;
    type: "Classic" | "Best3" | "Best5" | "Custom";
    mode: "League" | "Party";
    leftPlayer: Player;
    rightPlayer: Player;
    actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxRound: 1 | 3 | 5 | 7 | 9;
    status: "Not Started" | "Stopped" | "Playing" | "Finished" | "Deleted";
};
export {};
