import { RGBA, Timer } from "../types/Game.types";
export declare function turnDelayIsOver(timer: number): boolean;
export declare function colorHexToRgb(hexaColor: string): RGBA;
export declare function colorRgbToHex(rgbColor: RGBA): string;
export declare function defineTimer(second: number, reason: "Start" | "ReStart" | "Round" | "Pause" | "Deconnection", playerName?: string): Timer;
