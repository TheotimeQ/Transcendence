"use client";
import styles from "@/styles/pong/Pong.module.css";
import { useRef, useEffect } from "react";
import { pongKeyDown, pongKeyUp } from "@/lib/pong/eventHandlers";
import { initGame, gameLoop } from "@/lib/pong/handleGame";

type Props = {
  pong: Pong;
};

export default function Pong({ pong }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    canvasRef.current!.focus();
    const game = initGame(canvasRef.current!, pong);

    console.log(game);

    const handleKeyDown = (event: KeyboardEvent) => {
      pongKeyDown(event, game);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pongKeyUp(event, game);
    };

    requestAnimationFrame((timestamp) => gameLoop(timestamp, game));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [pong]);

  return (
    <div className={styles.pong}>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={1000}
          height={600}
        />
      </div>
    </div>
  );
}
