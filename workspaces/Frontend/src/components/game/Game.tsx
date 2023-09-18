"use client";

// Import des composants react
import { useEffect, useState } from "react";
import Link from "next/link";

// Import du style
import styles from "@/styles/game/Game.module.css";
import stylesError from "@/styles/game/GameError.module.css";

// Import des services
import LobbyService from "@/services/Lobby.service";
import GameService from "@/services/Game.service";

// Import des composants
import Pong from "./Pong";
import { GameData } from "@transcendence/shared/types/Game.types";
import LoadingComponent from "../loading/Loading";
import { set } from "react-hook-form";

type Props = {
  profile: Profile;
  token: String | undefined;
  gameId: String | undefined;
};

export default function Game({ profile, token, gameId }: Props) {
  const lobby = new LobbyService();

  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData>();
  const [error, setError] = useState<boolean>(false);
  const gameService = new GameService(token as string);
  const [joinEmitter, setJoinEmitter] = useState<boolean>(false);
  const [isPlayer, setIsPlayer] = useState<"Left" | "Right" | "Spectator">(
    "Spectator"
  );
  const [background, setBackground] = useState<HTMLImageElement | undefined>(
    undefined
  );
  const [ball, setBall] = useState<HTMLImageElement | undefined>(undefined);

  //------------------------------------Chargement------------------------------------//

  useEffect(() => {
    if (!joinEmitter) {
      setJoinEmitter(true);
      gameService.socket?.emit("join", gameId, (ret: any) => {
        if (ret.success == false) {
          setError(true);
        } else {
          const defineBackground = new Image();
          defineBackground.src = `/images/background/${ret.data.background}.png`;
          defineBackground.onload = () => {
            setBackground(defineBackground);
            const defineBall = new Image();
            defineBall.src = `/images/ball/${ret.data.ballImg}.png`;
            defineBall.onload = () => {
              setBall(defineBall);

              setGameData(ret.data);
              setIsLoading(false);
              setIsPlayer(
                ret.data.playerLeft.id === profile.id
                  ? "Left"
                  : ret.data.playerRight.id === profile.id
                  ? "Right"
                  : "Spectator"
              );
            };
          };
        }
      });
    }

    gameService.socket?.on("exception", () => {
      setError(true);
    });
    return () => {
      gameService.socket?.off("exception");
    };
  }, [gameId, gameService.socket, profile, joinEmitter]);

  //------------------------------------RENDU------------------------------------//

  //Si une erreur est survenue
  if (!gameService.socket || error) {
    return (
      <div className={stylesError.socketError}>
        <h2>Oops... Something went wrong!</h2>
        <Link href={"/home"} className={stylesError.errorLink}>
          <p>Return to Home Page!</p>
        </Link>
      </div>
    );
  }

  //Si la page n'est pas chargé
  if (isLoading) {
    return (
      <div className={styles.gameLoading}>
        <LoadingComponent />
      </div>
    );
  }

  if (!isLoading && gameData && gameService.socket && background && ball) {
    return (
      <div className={styles.game}>
        <Pong
          profile={profile}
          gameData={gameData}
          setGameData={setGameData}
          socket={gameService.socket}
          isPlayer={isPlayer}
          gameService={gameService}
          lobby={lobby}
          background={background}
          ball={ball}
        ></Pong>
      </div>
    );
  }
}
