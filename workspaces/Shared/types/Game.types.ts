import { ScoreInfo } from "./Score.types";

export enum Action {
  Idle = "Idle",
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
  Push = "Push",
  Stop = "Stop",
}

// Instead of enums, use type aliases and constants for DirX and DirY
export type DirX = -1 | 0 | 1;
export type DirY = -1 | 0 | 1;

export const DirXValues: { [key: string]: DirX } = {
  Left: -1,
  Idle: 0,
  Right: 1,
};

export const DirYValues: { [key: string]: DirY } = {
  Up: -1,
  Idle: 0,
  Down: 1,
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

export type Color = {
  menu: RGBA;
  font: RGBA;
  roundWon: RGBA;
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
  // Fixed Data from Backend
  id: string;
  name: string;
  ball: Ball;
  playerLeft: Player;
  playerRight: Player;
  playerLeftDynamic: PlayerDynamic;
  playerRightDynamic: PlayerDynamic;
  playerLeftStatus:
    | "Unknown"
    | "Connected"
    | "Playing"
    | "Paused"
    | "Disconnected";
  playerRightStatus:
    | "Unknown"
    | "Connected"
    | "Playing"
    | "Paused"
    | "Disconnected";
  background: string;
  ballImg: string;
  type: "Classic" | "Best3" | "Best5" | "Custom";
  mode: "League" | "Party" | "Training";
  hostSide: "Left" | "Right";
  difficulty: 1 | 2 | 3 | 4 | 5;
  push: boolean;
  color: Color;
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  maxRound: 1 | 3 | 5 | 7 | 9;

  // Dynamic Data
  playerServe: "Left" | "Right" | null;
  actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  score: ScoreInfo;
  timer: Timer | null;
  status: "Not Started" | "Stopped" | "Playing" | "Finished" | "Deleted";
  result: "Not Finished" | "Draw" | "Draw" | "Host" | "Opponent" | "Deleted";
  sendStatus: boolean;
  updateScore: boolean;
};

export type InitData = {
  id: string;
  name: string;
  type: "Classic" | "Best3" | "Best5" | "Custom";
  mode: "League" | "Party" | "Training";
  hostSide: "Left" | "Right";
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  maxRound: 1 | 3 | 5 | 7 | 9;
  difficulty: 1 | 2 | 3 | 4 | 5;
  push: boolean;
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
