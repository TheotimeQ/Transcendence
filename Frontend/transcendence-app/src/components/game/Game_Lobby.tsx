"use client";

//Import les composants react
import { useEffect, useState } from 'react'

//Import les composants
import Matchmaking_Button from '@/components/game/Matchmaking_Button'
import Matchmaking_Game_List from '@/components/game/Matchmaking_Game_List'
import Search_Box from '@/components/game/Popup_Search'

//Import le profil
import Profile from "@/services/Profile.service";

type Props = {
    profile: Profile;
    token: String | undefined;
}

//Import le service pour les games
import GameService from '@/services/Game.service'
import styles from '@/styles/game/game.module.css'

export default function Game_Lobby({ profile, token }: Props) {
    
    const Game = new GameService(token);
    
    //Pour le chargement ingame not in game
    const [isLoading, setIsLoading] = useState(true);
    const [inGame, setInGame] = useState(false);
    const [inMatchMaking, setinMatchMake] = useState(false);
    const [gameId, setGameId] = useState("undefined");

    //Pour la creation de la game
    const [gameName, setGameName] = useState("");
    const [gamePassword, setGamePassword] = useState("");
    const [createError, setCreateError] = useState("");

    useEffect(() => {

        Game.IsInGame().then((cur_game_id) => {
            
            if (cur_game_id != false) {
                setGameId(cur_game_id);
                setInGame(true);
            }
            
            setIsLoading(false);
        })

        .catch(error => {
            console.error(error);
            setIsLoading(false);
        });

    }, []);

    //Fonction pour quitter la game en cour
    const Quit_Game = async () => {
        await Game.Quit_Game();
        setInGame(false);
    };

    //Fonction pour rejoindre une game
    const Start_Matchmake = async () => {
        const res = await Game.Start_Matchmaking();
        setinMatchMake(res);
    };

    //Fonction pour rejoindre une game
    const Stop_Matchmake = async () => {
        await Game.Stop_Matchmaking();
        setinMatchMake(false);
    };

    //Fonction pour rejoindre une game
    const Create_Game = async (gameId : string) => {
        if (gameName == ""){
            setCreateError("Veuillez entrer un nom de partie");
            return;
        }
        await Game.Create_Game(gamePassword, gameName);
    };

    const handle_Game_Name = (event : any) => {
        setGameName(event.target.value);
    };
    
    const handle_Game_Password = (event : any) => {
        setGamePassword(event.target.value);
    };

    //------------------------------------RENDU------------------------------------//

    //Si la page n'est pas chargé
    if (isLoading) {
        return (
            <main className={styles.loading_page}>
                <h1>Chargement...</h1>
            </main>
        )
    }

    //Si le joueur est en game
    if (!isLoading && inGame){
        return (
            <main className={styles.main_resume}>
                <h1>Vous êtes en game</h1>
                <div className={styles.resume_box}>
                    {/* Boutons reprendre ou quitter*/}
                    { inGame && <Matchmaking_Button text="Reprendre la partie" onClick={() => Game.Resume_Game(gameId)} img="game/check"/>}
                    { inGame && <Matchmaking_Button text="Quitter la partie" onClick={Quit_Game} img="game/check"/>}
                </div>
            </main>
        );
    }

    //Si le joueur n'est pas en game
    if (!isLoading && !inGame){
        return (
            <main className={styles.main}>

                {/* Liste des game en lobby */}
                {<Matchmaking_Game_List token={token} />}

                {/* Boutons creer ou randomize*/}
                <div className={styles.button_box}>
                    <div className={styles.game_param}>
                        <div> <input  className={styles.game_input} type="text" onChange={handle_Game_Name} placeholder="Nom de la partie" /></div>
                        <div> <input  className={styles.game_input} type="text" onChange={handle_Game_Password} placeholder="Mot de passe" />    </div>
                        <div> <p className={styles.error}>{createError}</p>    </div>
                    </div>
                    <Matchmaking_Button text="Créer une partie" onClick={Create_Game} img="game/check"/>
                    <Matchmaking_Button text="Randomize" onClick={Start_Matchmake} img="game/check"/>
                </div>    

                {/* Popup matchmake */}
                { inMatchMaking && <Search_Box funct={(Stop_Matchmake)} />} 
            </main>
        );
    }
}
