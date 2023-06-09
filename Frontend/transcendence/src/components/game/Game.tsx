"use client";

//Import les composants react
import { useEffect, useState, useMemo } from "react";

//Import les services
import LobbyService from "@/services/Lobby.service";

//Import les composants
import ButtonImg from "./ButtonImg";
import styles from "@/styles/game/game.module.css";
import Pong from "./Pong";

type Props = {
	profile: Profile;
	token: String | undefined;
	gameID: String | undefined;
};

export default function Game({ profile, token, gameID }: Props) {
	const Lobby = useMemo(() => new LobbyService(token), [token]);

	const [isLoading, setIsLoading] = useState(true);
	const [gameInfos, setGameInfo] = useState<GameInfos>();

	//------------------------------------Chargement------------------------------------//

	//Regarde si le joueur est en game, si oui , le remet dans la game
	useEffect(() => {
		//Si pas possible d'avoir les données de la game -> retour au lobby
		Lobby.Get_Game_Info(gameID)
			.then((gameInfos) => {
				if (gameInfos.success == false) {
					Lobby.Load_Page("/home");
				} else {
					setGameInfo(gameInfos);
				}
				console.log(gameInfos);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setIsLoading(false);
			});
	}, [Lobby, gameID]);

	const Quit = () => {
		Lobby.Quit_Game();
		Lobby.Load_Page("/home");
	};

	//------------------------------------RENDU------------------------------------//

	//Si la page n'est pas chargé
	if (isLoading) {
		return (
			<div className={styles.gameLoading}>
				<h1>Chargement...</h1>
			</div>
		);
	}

	//Si la page n'est pas chargé
	if (!isLoading && gameInfos) {
		return (
			<div className={styles.Game}>
				<Pong gameInfos={gameInfos} AI={true} />
				<ButtonImg text="quit" onClick={Quit} img="lobby/check" />
			</div>
		);
	}
}
