import styles from '@/styles/game/Popup_Search.module.css';
import Image from 'next/image';

export default function SearchBox({ funct } : { funct: any}) {
    return (
        <div className={styles.search_box}>
            <div>
                <Image src={`/images/game/spin.gif`} alt={"sping_loading"} width="50" height="50"/>
            </div>

            <h2>Recherche d'un adversaire</h2>
            <p>Veuillez patienter pendant que nous recherchons activement un adversaire à votre taille...</p>

            <button className={`${styles.stop_button} ${styles.mer}`} onClick={funct} >
                Stopper la recherche
            </button>
        </div>
    );
}