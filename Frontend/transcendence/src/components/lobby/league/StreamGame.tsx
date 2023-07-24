import styles from "@/styles/lobby/league/StreamGame.module.css";
import { useState } from "react";

type Props = {
	Lobby: any;
	json: GameRanked[];
};

export default function StreamGame({ Lobby, json }: Props) {

	console.log(json);

	const [gameSelected, setGame] = useState<GameRanked>( {} as GameRanked);

	const handleHover = (game : GameRanked) => {
		setGame(game);
	}

	if (json.length === 0) {

		return (
			<div className={styles.StreamGame}>

				<h1>Watch game</h1>

				<p className={styles.loading}>Recherche en cours...</p>
				
			</div>
		)
	}

	return (

		<div className={styles.StreamGame}>

			<h1>Watch game</h1>

			<div className={styles.resume}>
				<p>{gameSelected.Host}</p>
				<p>{gameSelected.Opponent}</p>
			</div>

			<div className={styles.gamelist}>
                {json.map((game: any, index: number) => (
                    <div className={styles.game} key={index} onMouseEnter={() => handleHover(game)} >
                        <p>{game.Name}</p>
                        <p>{game.Host}</p>
                        <p>{game.Opponent}</p>
						<p>{game.Viewers_List}</p>
						<p>{game.Score_Host}</p>
						<p>{game.Score_Opponent}</p>
						<p>{game.CreatedAt}</p>
						<p>{game.Mode}</p>
						<button className={styles.watchbutton} onClick={() => Lobby.Load_Page("home/game/" + game.uuid)}>Watch</button>
                    </div>
                ))}
            </div>

		</div>
	)
}
