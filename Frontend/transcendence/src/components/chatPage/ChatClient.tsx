"use client"

import { useEffect, useState } from "react";
import stylesError from "@/styles/chatPage/ChatPage.module.css";
import styles from "@/styles/chatPage/ChatClient.module.css";
import Conversations from "./Conversations";
import ChatDisplay from "./ChatDisplay";
import ChatService from "@/services/chat/Chat.service";
import Link from "next/link";

export default function ChatClient({ token }: {
	token: string;
}) {
	const	[littleScreen, setLittleScreen] = useState<boolean>(true);
	const	[open, setOpen] = useState<boolean>(false);
	const	[display, setDisplay] = useState<Channel | Pongie>();
	const	chatService = new ChatService(token);

	const	openDisplay = (display: Channel | Pongie) => {
		setOpen(true);
		setDisplay(display);
	}

	const	closeDisplay = () => {
		setOpen(false);
	}

	useEffect(() => {
		const handleResize = () => {
		  const screenWidth = window.innerWidth;
		  setLittleScreen(screenWidth < 800);
		};
	
		handleResize();
	
		window.addEventListener("resize", handleResize);
	
		return () => {
		  window.removeEventListener("resize", handleResize);
		};
	  }, []);

	if (!chatService.socket) {
		return (
			<div className={stylesError.error}>
				<h2>Oops... Something went wrong!</h2>
				<Link href={"/home"} className={stylesError.errorLink}>
					<p>Return to Home Page!</p>
				</Link>
			</div>
		)
	}

	// narrow screen width, display not opened
	if (littleScreen && !open)
		return (
			<div className={styles.main}>
				<Conversations
					socket={chatService.socket}
					maxWidth="100%"
					openDisplay={openDisplay}
				/>
			</div>
		);

	// narrow screen width, display opened
	if (littleScreen && open)
		return (
			<div className={styles.main}>
				<ChatDisplay
					socket={chatService.socket}
					display={display}
					littleScreen={littleScreen}
					closeDisplay={closeDisplay}
				/>
			</div>
		);

	// wide screen width, open both
	return (
		<div className={styles.main}>
			<Conversations
				socket={chatService.socket}
				maxWidth="300px"
				openDisplay={openDisplay}
			/>
			<ChatDisplay
				socket={chatService.socket}
				display={display}
				littleScreen={littleScreen}
				closeDisplay={closeDisplay}
			/>
		</div>
	)
}
