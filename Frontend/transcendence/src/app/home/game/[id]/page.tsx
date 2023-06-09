//Server side rendering

//Merdouille pour les cookies
import { cookies } from "next/dist/client/components/headers";

//Import le composant pour le lobby
import styles from "@/styles/game/game.module.css";
import Game from "@/components/game/Game";
import Profile_Service from "@/services/Profile.service";
import { Refresher } from "@/components/refresher/Refresher";

export default async function GamePage({ params, searchParams }: any) {
  // [!] Bperriol i changed this profile
  let profile: Profile = {
    id: -1,
    login: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    image: "",
    provider: "",
    motto: "",
    story: "",
  };
  let token: string | undefined;
  let gameID = params.id;

  try {
    token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    const profileData = new Profile_Service(token);
        profile = await profileData.getProfileByToken();
  } catch (err) {
    console.log(err);
  }

  return (
    <main className={styles.First_Frame}>
      <Refresher />
      <Game profile={profile} token={token} gameID={gameID} />
    </main>
  );
}
