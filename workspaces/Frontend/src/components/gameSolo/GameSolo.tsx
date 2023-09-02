"use client";

// Import des composants react
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import du style
import styles from "@/styles/game/Game.module.css";

// Import des services
import TrainingService from "@/services/Training.service";

// Import des composants
import { GameData } from "@transcendence/shared/types/Game.types";
import PongSolo from "./PongSolo";
import ErrorGameSolo from "./ErrorGameSolo";
import LoadingComponent from "../loading/Loading";

type Props = {
  profile: Profile;
  trainingId: string;
};

export default function GameSolo({ profile, trainingId }: Props) {
  const router = useRouter();
  const trainingService = new TrainingService();

  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData>();
  const [error, setError] = useState<boolean>(false);
  const [isPlayer, setIsPlayer] = useState<"Left" | "Right" | "">("");

  //------------------------------------Chargement------------------------------------//

  useEffect(() => {
    const getData = async () => {
      if (isLoading) {
        const ret = await trainingService.getTrainingData(trainingId);
        if (ret.success == false) {
          setError(true);
        } else {
          console.log(ret.data);
          if (ret.data.status === "Finished") {
            router.push("/home");
          } else {
            setGameData(ret.data);
            setIsLoading(false);
          }
          if (ret.data.playerLeft.id === profile.id) {
            setIsPlayer("Left");
          } else if (ret.data.playerRight.id === profile.id) {
            setIsPlayer("Right");
          } else {
            setIsPlayer("");
            setError(true);
          }
        }
      }
    };
    getData();
  }, []);

  //------------------------------------RENDU------------------------------------//

  //Si une erreur est survenue
  if (error) {
    return <ErrorGameSolo />;
  }

  //Si la page n'est pas chargé
  if (isLoading) {
    return (
      <div className={styles.gameLoading}>
        <LoadingComponent />
      </div>
    );
  }

  if (!isLoading && gameData) {
    return (
      <div className={styles.game}>
        <PongSolo
          gameData={gameData}
          setGameData={setGameData}
          isPlayer={isPlayer}
          trainingService={trainingService}
        />
      </div>
    );
  }
}
