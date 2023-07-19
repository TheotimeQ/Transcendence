import styles from "@/styles/chatPage/ChatDisplay.module.css";
import { faPeopleGroup, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { Socket } from "socket.io-client";
import ChatChannel from "./ChatChannel/ChatChannel";
import DisplayInfos from "./displayInfos/DisplayInfos";
import {
  faMessage,
  faFaceLaughBeam,
} from "@fortawesome/free-regular-svg-icons";

export default function ChatDisplay({
  socket,
  display,
  littleScreen,
  closeDisplay,
  myself,
  openDisplay,
}: {
  socket: Socket;
  display: Display;
  littleScreen: boolean;
  closeDisplay: () => void;
  myself: Profile & { avatar: Avatar };
  openDisplay: (display: Display) => void;
}) {
  const renderIcon = (): ReactNode => {
    if (littleScreen)
      return (
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={closeDisplay}
          className={styles.iconArrow}
        />
      );

    if (!display)
      return <FontAwesomeIcon icon={faMessage} className={styles.icon} />;

    if ("button" in display && display.button === "new")
      return <FontAwesomeIcon icon={faMessage} className={styles.icon} />;

    if (
      "name" in display ||
      ("button" in display && display.button === "channels")
    )
      return <FontAwesomeIcon icon={faPeopleGroup} className={styles.icon} />;

    if (
      "login" in display ||
      ("button" in display && display.button === "pongies")
    )
      return <FontAwesomeIcon icon={faFaceLaughBeam} className={styles.icon} />;
  };

  if (!display) return <div className={styles.main}></div>;

  if ("button" in display) {
    return (
      <div className={styles.main}>
        <DisplayInfos
          icon={renderIcon()}
          socket={socket}
          display={display}
          openDisplay={openDisplay}
          littleScreen={littleScreen}
        />
      </div>
    );
  }

  if ("name" in display) {
	// [+][!] a clean une fois inutile
    // if ("type" in display && display.type === "privateMsg") {
      return (
        <div className={styles.main + " " + styles.noPadding}>
          <ChatChannel
            icon={renderIcon()}
            channel={display}
            myself={myself}
            socket={socket}
          />
        </div>
      );
    // } else {
	// 	// [+][!] provisoire
    //   return <div className={styles.main}>
	// 	<h1>{"name" in display && display.name}</h1>
	// 	<h1>{"id" in display && display.id}</h1>
	//   </div>;
    // }
  }
}
