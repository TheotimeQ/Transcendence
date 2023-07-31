import { updatePong } from "@transcendence/shared/game/updatePong";
import { drawPong } from "./drawPong";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";

const lastTimestampRef = { current: 0 };
const lastFpsUpdateTimeRef = { current: 0 };
const frameCountRef = { current: 0 };
const fpsRef = { current: 0 };
const showFpsRef = true;

export const gameLoop = (
  timestamp: number,
  game: GameData,
  draw: Draw,
  isMountedRef: React.MutableRefObject<boolean>
) => {
  const elapsedTime = timestamp - lastTimestampRef.current;
  frameCountRef.current++;

  if (!isMountedRef.current) return;
  if (elapsedTime >= 16.67) {
    if (game.status === "Playing") {
      updatePong(game);
    }
    drawPong(game, draw);

    lastTimestampRef.current = timestamp;
  }

  const currentTime = performance.now();
  const elapsedFpsTime = currentTime - lastFpsUpdateTimeRef.current;

  if (elapsedFpsTime >= 1000) {
    // Calculate FPS
    fpsRef.current = Math.round(
      (frameCountRef.current * 1000) / elapsedFpsTime
    );

    // Display FPS
    if (showFpsRef) console.log("FPS:", fpsRef.current);

    frameCountRef.current = 0;
    lastFpsUpdateTimeRef.current = currentTime;
  }

  const targetDelay = 1000 / 60; // 60 FPS
  const remainingDelay = Math.max(
    targetDelay - (performance.now() - timestamp),
    0
  );
  setTimeout(() => {
    requestAnimationFrame((timestamp) =>
      gameLoop(timestamp, game, draw, isMountedRef)
    );
  }, remainingDelay);
};
