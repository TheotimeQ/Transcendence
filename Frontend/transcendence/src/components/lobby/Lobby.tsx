"use client";

//Import les composants react
import { useState } from "react";
import { MdHistory, MdGames, MdLeaderboard } from "react-icons/md";

type Props = {
	profile: Profile;
	token: string | undefined;
};

//Import le service pour les games
import styles from "@/styles/lobby/Lobby.module.css";
import League from "./league/League";
import Party from "./party/Party";
import History from "./history/History";

import LobbyService from "@/services/Lobby.service";
import MatchmakingService from "@/services/Matchmaking.service";

export default function Lobby({ profile, token }: Props) {

	const Lobby = new LobbyService(token);
	const Matchmaking = new MatchmakingService(token);

	const [isLoading, setIsLoading] = useState(true);
	const [menu, setMenu] = useState("League");

	// ----------------------------------  CHARGEMENT  ---------------------------------- //

	//Regarde si le joueur est en game, si oui , le remet dans la game
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
		});

	// -------------------------------------  RENDU  ------------------------------------ //

	//Si le joueur n'est pas en game
	return (
		<div className={styles.lobby}>
			<nav className={styles.menu}>
				<button
					className={`${menu === "League" ? styles.activeBtn : styles.inactiveBtn
						}`}
					onClick={() => setMenu("League")}
				>
					<MdLeaderboard size={40} />
					<h2>League</h2>
				</button>
				<button
					className={`${menu === "Party" ? styles.activeBtn : styles.inactiveBtn
						}`}
					onClick={() => setMenu("Party")}
				>
					<MdGames size={40} />
					<h2>Party</h2>
				</button>
				<button
					className={`${menu === "History" ? styles.activeBtn : styles.inactiveBtn
						}`}
					onClick={() => setMenu("History")}
				>
					<MdHistory size={40} />
					<h2>Training</h2>
				</button>
			</nav>
			<div className={styles.content}>
				{menu == "League"  && <League Matchmaking={Matchmaking} isLoading={isLoading} />}
				{menu == "Party"   && <Party Lobby={Lobby} isLoading={isLoading} token={token} />}
				{menu == "History" && <History Lobby={Lobby} isLoading={isLoading} />}
			</div>
		</div>
	);
}
