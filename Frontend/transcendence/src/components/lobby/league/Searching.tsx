import React, { useState, useEffect} from "react";

import DefineType from "@/components/lobby/league/DefineType";
import styles from "@/styles/lobby/league/Searching.module.css";
import Image from "next/image";

type Props = {
	Matchmaking : any;
};

export default function Searching({Matchmaking}: Props) {

	const [type, setType] = useState<string>("classic");
	const [inMatchMaking, setinMatchMake] = useState(false);

	const Start_Matchmake = async () => {
		const res = await Matchmaking.Start_Matchmaking(type); 
		setinMatchMake(res);
	};

	const Stop_Matchmake = async () => {
		await Matchmaking.Stop_Matchmaking();
		setinMatchMake(false);
	};

	return (

		<div className={styles.Searching}>

			<h1>Look for opponent</h1>

			<div className={styles.ImgBox}>
				{ !inMatchMaking && <DefineType type={type} setType={setType} /> }
				{/* {  inMatchMaking && <Image src={`/images/lobby/balls.gif`} alt="Searching giff" width="50" height="50" /> } */}
				{  inMatchMaking && <p className={styles.loading} >Looking for opponent...</p> }
			</div>

			<div className={styles.ButtonBox}>
				{ !inMatchMaking && <button className={styles.searchBtn} onClick={Start_Matchmake}>
					<p>Start Search</p>
				</button> }
				{  inMatchMaking && <button className={styles.searchBtn} onClick={Stop_Matchmake}>
					<p>Stop Search</p>
				</button> }
			</div>

		</div>
	)
}
