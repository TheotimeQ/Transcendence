"use client";

import { useMemo } from "react";
import One_Game from "@/components/lobby/noupdated/Matchmaking_Game_Infos";
import styles from "@/styles/lobby/party/PartyList.module.css";

import Matchmaking_Search from "@/components/lobby/noupdated/Matchmaking_Search";

import LobbyService from "@/services/Lobby.service";

import { useEffect, useState } from "react";

type Props = {
  token: String | undefined;
};

interface Game {
  uuid: string;
  Name: string;
  Host: number;
  Opponent: number;
  Viewers_List: number;
  Score_Host: number;
  Score_Opponent: number;
  Status: string;
  CreatedAt: string;
  Winner: number;
  Loser: number;
}

export default function PartyList({ token }: Props) {
  //Import le service pour les games
  const Lobby = useMemo(() => new LobbyService(token), [token]);
  const [jsonGame, setJsonGame] = useState([] as Game[]);
  const [filteredGames, setFilteredGames] = useState([] as Game[]);
  const [LastSearch, setLastSearch] = useState("");

  //Recupere la liste des games regulierement
  useEffect(() => {
    const interval = setInterval(() => {
      Lobby.Get_Game_List().then((json) => {
        setJsonGame(json);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [Lobby]);

  //Filter les games en fonction de la recherche
  useEffect(() => {
    // Parcours le JSON et ne garde que les game qui match avec la recherche
    if (LastSearch !== "" && jsonGame[0].uuid != "Loading") {
      const filteredGames = jsonGame.filter((item: Game) =>
        item.Name.toLowerCase().includes(LastSearch.toLowerCase())
      );
      setFilteredGames(filteredGames);
      console.log(filteredGames);
    } else {
      setFilteredGames(jsonGame);
    }
  }, [LastSearch, jsonGame]);

  // Fonction qui update larecherche
  const Update_Search = (searchTerm: string) => {
    setLastSearch(searchTerm);
  };

  return (
    <div className={styles.game_list_main}>
      <Matchmaking_Search onChangeFct={Update_Search} />
      <div className={styles.game_list}>
        {filteredGames.length === 0 && (
          <p className={styles.loading}>Recherche en cours...</p>
        )}
        {filteredGames.length > 0 &&
          filteredGames.map((game: any, index: number) => (
            <One_Game game={game} key={index} />
          ))}
      </div>
    </div>
  );
}
