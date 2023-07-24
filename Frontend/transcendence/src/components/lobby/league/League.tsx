"use client";

import React, { useState, useEffect, useMemo} from "react";
import styles from "@/styles/lobby/league/League.module.css";
import LobbyService from "@/services/Lobby.service";

import Searching from "@/components/lobby/league/Searching";
import Leaderboard from "@/components/lobby/league/Leaderboard";
import StreamGame from "@/components/lobby/league/StreamGame";

type Props = {
	Matchmaking: any;
	token: string | undefined;
};

export default function League({ Matchmaking, token }: Props) {

	const Lobby = useMemo(() => new LobbyService(token), [token]);
	const [json, setJson] = useState<League>( {Top10: [], AllRanked: []} as League);

	//Recupere les games et les players pour les afficher
	useEffect(() => {
		const interval = setInterval(() => {
			Lobby.Get_League().then((json) => { setJson(json); });
		}, 1000);
		return () => clearInterval(interval);
	}, [Lobby]);

	// -----------------------------------  MATCHMAKE  ---------------------------------- //
	
	return (
		<div className={styles.league}>
			<Searching Matchmaking={Matchmaking}/>
			<Leaderboard json={json.Top10}/>
			<StreamGame Lobby={Lobby} json={json.AllRanked} />
		</div>
	);
}
