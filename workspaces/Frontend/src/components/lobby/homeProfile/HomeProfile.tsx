"use client";

import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import Link from "next/link";
import AvatarUser from "../../avatarUser/AvatarUser";
import GameStats from "./GameStats";
import { BuildTwoTone } from "@mui/icons-material";
import { useState } from "react";
import Achievement from "./Achievement";

type Props = {
  profile: Profile;
  avatar: Avatar;
};

export default function HomeProfile({ profile, avatar }: Props) {
  const [showAchievement, setShowAchievement] = useState<boolean>(false);
  return (
    <div className={styles.homeProfil}>
      <Link className={styles.links} href={`/home/profile/${profile.id}`}>
        <div className={styles.avatarAndLogin}>
          <div className={styles.avatar}>
            <AvatarUser
              avatar={avatar}
              borderSize={"6px"}
              backgroundColor={avatar.backgroundColor}
              borderColor={avatar.borderColor}
              fontSize="3rem"
            />
          </div>
          <div className={styles.login}>{profile.login}</div>
        </div>
      </Link>
      <GameStats profile={profile} />
      <button onClick={() => setShowAchievement(!showAchievement)}>
        Show achievement
      </button>
      {showAchievement && <Achievement profile={profile} setShowAchievement={setShowAchievement} />}
    </div>
  );
}
