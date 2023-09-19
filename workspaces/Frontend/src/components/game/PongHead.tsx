"use client";

// Import du style
import styles from "@/styles/game/PongHead.module.css";

// Import GameLogic
import { GameData } from "@transcendence/shared/types/Game.types";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import GameService from "@/services/Game.service";
import LobbyService from "@/services/Lobby.service";
import { useState } from "react";
import Profile_Service from "@/services/Profile.service";
import disconnect from "@/lib/disconnect/disconnect";

type Props = {
  profile: Profile;
  gameData: GameData;
  gameService: GameService;
  lobby: LobbyService;
  isPlayer: "Left" | "Right" | "Spectator";
  isMountedRef: React.MutableRefObject<boolean>;
};

export default function PongHead({
  profile,
  gameData,
  gameService,
  lobby,
  isPlayer,
  isMountedRef,
}: Props) {
  const router = useRouter();
  const [quitStatus, setQuitStatus] = useState<boolean>(false);
  const profileService = new Profile_Service();
  const [gameKey, setGameKey] = useState<"Arrow" | "ZQSD" | "WASD">(
    profile.gameKey
  );
  const [prof, setProf] = useState<Profile>(profile);

  async function quit() {
    if (quitStatus) {
      return;
    }
    setQuitStatus(true);
    gameService.socket?.emit("quit");
    if (isPlayer === "Spectator") {
      router.push("/home");
    }
  }

  async function changeKey() {
    const selectedValue =
      gameKey === "Arrow" ? "ZQSD" : gameKey === "ZQSD" ? "WASD" : "Arrow";

    if (
      selectedValue === "Arrow" ||
      selectedValue === "ZQSD" ||
      selectedValue === "WASD"
    ) {
      setGameKey(selectedValue);
      const rep: Rep = await profileService.editUser({
        gameKey: selectedValue,
      });
      if (rep.success) {
        const updatedProfile = profile;
        updatedProfile.gameKey = selectedValue;
        setProf(updatedProfile);
      } else {
        if (rep.message === "disconnect") {
          await disconnect();
          router.refresh();
          return;
        }
      }
    }
  }

  return (
    <div className={styles.pongHead}>
      {isPlayer === "Spectator" && <div className={styles.leftBlock}></div>}
      {isPlayer !== "Spectator" && (
        <button onClick={changeKey} className={styles.keyBtn}>
          {gameKey === "Arrow" && "↑↓"}
          {gameKey === "ZQSD" && "ZS"}
          {gameKey === "WASD" && "WS"}
        </button>
      )}
      <h2 className={styles.title}>{gameData.name}</h2>
      {gameData.result !== "Not Finished" && <div className={styles.quitBlock}></div>}
      {gameData.result === "Not Finished" &&
        <button onClick={quit} className={styles.quitBtn}>
        <MdClose />
      </button>
      }
    </div>
  );
}
