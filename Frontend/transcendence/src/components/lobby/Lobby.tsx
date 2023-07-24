"use client";

//Import les composants react
import { useState } from "react";
import { MdHistory, MdGames, MdLeaderboard } from "react-icons/md";

//Import le service pour les games
import LobbyService from "@/services/Lobby.service";
import styles from "@/styles/lobby/Lobby.module.css";
import League from "@/components/lobby/league/League";
import Party from "@/components/lobby/party/Party";
import History from "@/components/lobby/history/History";
import NavLobby from "./NavLobby";
import MatchmakingService from "@/services/Matchmaking.service";

type Props = {
    profile: Profile;
    token: string | undefined;
};

export default function Lobby({ profile, token }: Props) {
    
    const Lobby = new LobbyService(token);
    const Matchmaking = new MatchmakingService(token);

    const [isLoading, setIsLoading] = useState(true);
    const [menu, setMenu] = useState("League");

    Lobby.IsInGame()
        .then((cur_game_id) => {
            if (cur_game_id != false) {
                Lobby.Resume_Game(cur_game_id);
            }
            setIsLoading(false);
        })

        .catch((error) => {
            console.error(error);
            setIsLoading(false);
        }
    );

    return (
        <div className={styles.lobby}>
            <NavLobby menu={menu} setMenu={setMenu} />
            <div className={styles.content}>
                {menu == "League" && (<League Matchmaking={Matchmaking} token={token}/>)}
                {menu == "Party" &&  (<Party Lobby={Lobby} isLoading={isLoading} token={token} />)}
                {menu == "History" && <History Lobby={Lobby} isLoading={isLoading} />}
            </div>
        </div>
    );
}
