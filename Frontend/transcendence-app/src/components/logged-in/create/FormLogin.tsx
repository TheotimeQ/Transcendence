"use client"

import { checkLoginFormat } from "@/lib/create/checkLogin";
import ChooseAvatar from "./ChooseAvatar";
import styles from "@/styles/create/Create.module.css";
import { useEffect, useRef, useState } from "react";
import { handleActionServer } from "@/lib/create/handleActionServer";
import { useRouter } from "next/navigation";
import avatarType from "@/types/Avatar.type";

export default function FormLogin({ avatars, token }: {
	avatars: string[],
	token: string,
}) {

	const	[notif, setNotif] = useState<string>("");
	const	[text, setText] = useState<string>("");
	const	[access_token, setToken] = useState<string>("");
	const	router = useRouter();
	const	avatarChosenRef = useRef<avatarType>({
		image: "",
		variant: "circular",
		borderColor: "var(--accent-color)",
		backgroundColor: "var(--accent-color)",
		text: "",
		empty: true,
	});

	const	selectAvatar = (avatar: avatarType) => {
		avatarChosenRef.current = avatar;
	}

	const	borderColor = (color: string) => {
		avatarChosenRef.current.borderColor = color;
	}

	const	backgroundColor = (color: string) => {
		avatarChosenRef.current.backgroundColor = color;
	}

	const	handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
		const	text = e.target.value;

		avatarChosenRef.current.text = text.toUpperCase().slice(0, 2);
		setText(text.toUpperCase().slice(0, 2));
	}

	useEffect(() => {

		const changeCookie = async () => {
			try {
				const	res = await fetch("http://localhost:3000/api/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						access_token,
					}),
				});

				const	data = await res.json();

				if (!res.ok || data.error)
					throw new Error();
				
				router.refresh();
			}
			catch (error) {
				console.log(error);
				setNotif("Something went wrong, please try again");
			}

		}

		if (access_token.length > 0) {
			changeCookie();
		}
	}, [access_token])
	
	const	handleActionLogin = async (data: FormData) => {
		const	loginUser = data.get('login') as string;
		const	loginChecked = checkLoginFormat(loginUser);
		setNotif(loginChecked);

		if (loginChecked.length > 0)
			return ;
		
		const	res: {
			exists: string,
			token: string,
		} = await handleActionServer(loginUser, avatarChosenRef.current, token);

		setNotif(res.exists);
		setToken(res.token);
	}

	return (
		<div className={styles.main}>
			<h3>You're almost there! 😁</h3>

			<form action={handleActionLogin}>
				<label>
					Please choose your login!
				</label>
				<p className={styles.little}>Don't worry, you can change it later.</p>
				
				<input
					type="text"
					name="login"
					placeholder="login"
					maxLength={10}
					onChange={handleText}
				/>

				{notif.length > 0 && <div className={styles.notif}>{notif}</div>}
				<p className={styles.choose}>Make you pretty:</p>
				
				<div className={styles.avatars}>
					<ChooseAvatar
						selectBorder={borderColor}
						selectBackground={backgroundColor}
						selectAvatar={selectAvatar}
						text={text}
						avatars={avatars}
					/>
				</div>

				<button>Let's go!</button>
			</form>

		</div>
	);
}

