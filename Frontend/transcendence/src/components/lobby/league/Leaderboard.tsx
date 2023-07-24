import styles from "@/styles/lobby/league/Leaderboard.module.css";

type Props = {
	json: PlayerLeaderBoard[];
};

export default function Leaderboard({ json }: Props) {

    return (

        <div className={styles.leaderboard}>

            <h1>Ranking</h1>

            <div className={styles.podium}>
                {json.length === 0 && (<p className={styles.loading}>Recherche en cours...</p>)}
                <div className={styles.second}>
                    <div className={styles.pad}>
                        <p>2</p>
                    </div>
                    {json.length > 1 && json[1] && (
                        <p>{json[1].login}</p>
                    )}
                </div>
                <div className={styles.first}>
                    <div className={styles.pad}>
                        <p>1</p>
                    </div>
                    {json.length > 0 && json[0] && (
                        <p>{json[0].login}</p>
                    )}
                </div>
                <div className={styles.third}>
                    <div className={styles.pad}>
                        <p>3</p>
                    </div>
                    {json.length > 2 && json[2] && (
                        <p>{json[2].login}</p>
                    )}
                </div>
            </div>

            <div className={styles.playerlist}>
                {json.length === 0 && (<p className={styles.loading}>Recherche en cours...</p>)}
                {json.length > 0   && json.map((player: any, index: number) => (
                    <div className={styles.player} key={index}>
                        <p>{player.login}</p>
                        <p>{player.score}</p>
                        <p>{player.rank}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}
