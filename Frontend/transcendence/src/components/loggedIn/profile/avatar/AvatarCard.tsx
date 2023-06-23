"use client";

import styles from "@/styles/loggedIn/profile/AvatarCard.module.css";
import Profile from "@/services/Profile.service";
import Avatar from "./Avatar";
import ProfileLogin from "./ProfileLogin";
import avatarType from "@/types/Avatar.type";
import { CSSProperties, useState } from "react";
import SettingsCard from "./SettingsCard";
import { Color, ColorChangeHandler, ColorResult } from "react-color";
import submitAvatarColors from "@/lib/avatar/submitAvatarColors";

type Props = {
  profile: Profile;
  isOwner: boolean;
  avatar: avatarType;
  token: string;
};

export default function AvatarCard({ profile, isOwner, avatar, token }: Props) {
  const [displaySettings, setDisplaySettings] = useState<boolean>(false);
  const [topColor, setTopColor] = useState<Color>(avatar.borderColor);
  const [botColor, setBotColor] = useState<Color>(avatar.backgroundColor);
  const [selectedArea, setSelectedArea] = useState<"border" | "background">(
    "border"
  );

  const handleArea = (
    event: React.MouseEvent<HTMLElement>,
    newArea: "border" | "background" | null
  ) => {
    if (newArea) setSelectedArea(newArea);
  };

  const toogleDisplaySettings = () => {
    if (displaySettings === true) cancelColorChange();
    setDisplaySettings(!displaySettings);
  };

  const saveColorChanges = async () => {
    // [!] ici envoyer les updates color au back
    // verif si il y a eut un changement avant ?

    const response = await submitAvatarColors(
      topColor.toString(),
      botColor.toString(),
      token
    );

    avatar.borderColor = topColor.toString();
    avatar.backgroundColor = botColor.toString();
    setDisplaySettings(false);
  };

  const colorAddedStyle: CSSProperties = {
    backgroundColor: topColor.toString(),
  };

  const previewChangeTopColor = (color: string) => {
    setTopColor(color);
  };

  const previewChangeBotColor = (color: string) => {
    setBotColor(color);
  };

  const cancelColorChange = () => {
    setTopColor(avatar.borderColor);
    setBotColor(avatar.backgroundColor);
  };

  return (
    <div className={styles.avatarFrame}>
      <div className={styles.avatarCard}>
        <div className={styles.rectangle} style={colorAddedStyle}>
          <div className={styles.top} style={colorAddedStyle}></div>
          <div className={styles.bot}></div>

          <Avatar
            avatar={avatar}
            onClick={toogleDisplaySettings}
            displaySettings={displaySettings}
            previewBorder={topColor.toString()}
            previewBackground={botColor.toString()}
          />
        </div>
        <ProfileLogin profile={profile} isOwner={isOwner} />
      </div>
      {displaySettings && (
        <SettingsCard
          previewChangeTopColor={previewChangeTopColor}
          previewChangeBotColor={previewChangeBotColor}
          handleArea={handleArea}
          selectedArea={selectedArea}
          toogleDisplaySettings={toogleDisplaySettings}
          saveColorChanges={saveColorChanges}
        />
      )}
    </div>
  );
}
