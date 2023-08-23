import Profile_Service from "@/services/Profile.service";
import ErrorProfile from "./ErrorProfile";
import ProfileMainFrame from "./ProfileMainFrame";
import { cookies } from "next/headers";
import Avatar_Service from "@/services/Avatar.service";
import { verifyAuth } from "@/lib/auth/auth";
import fs from "fs";

export default async function ProfileServer({ id }: {
	id: number;
}) {
	let	token: string = "";
	let isProfilOwner: boolean = false;
	let avatar: Avatar = {
		image: "",
		variant: "",
		borderColor: "",
		backgroundColor: "",
		text: "",
		empty: true,
		isChannel: false,
		decrypt: false,
	};

	let targetProfile: Profile = {
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
	let	avatars: Avatar[] = [];

	try {
		if (!id)
			throw new Error('no id');
		
		const	getToken = cookies().get('crunchy-token')?.value;

		if (!getToken)
			throw new Error('no token');
		
		token = getToken;

		const	payload: any = await verifyAuth(token);

		if (payload.sub.toString() === id.toString())
			isProfilOwner = true;
		
		const	profileService = new Profile_Service(token);
		targetProfile = await profileService.getProfileById(id);

		if (targetProfile.id < 0)
			throw new Error(`user id : ${targetProfile.id}`);

		const avatarService = new Avatar_Service(token);

		avatar = await avatarService.getAvatarbyUserId(targetProfile.id);

		if (isProfilOwner) {
			const	directoryPath = "/home/workspaces/Frontend/public/images/avatars";
			const	pathes = fs.readdirSync(directoryPath);
			avatars = pathes.map((path) => {
				if (path.includes("avatar"))
					return {
						image: "/images/avatars/" + path,
						variant: avatar.variant,
						borderColor: avatar.borderColor,
						backgroundColor: avatar.backgroundColor,
						text: avatar.text,
						empty: false,
						isChannel: false,
						decrypt: false,
					}
					// return "/images/avatars/" + avatar;
				return avatar;
			});
			
			if (targetProfile.provider === '42') {
				avatars.unshift({
					image: targetProfile.image,
					variant: avatar.variant,
					borderColor: avatar.borderColor,
					backgroundColor: avatar.backgroundColor,
					text: "",
					empty: false,
					isChannel: false,
					decrypt: true,
				});
			}
			
			avatars.unshift({
				image: "",
				variant: avatar.variant,
				borderColor: avatar.borderColor,
				backgroundColor: avatar.backgroundColor,
				text: targetProfile.login.toUpperCase().slice(0, 3),
				empty: false,
				isChannel: false,
				decrypt: false,
			});

			avatars.unshift({
				image: "",
				variant: avatar.variant,
				borderColor: avatar.borderColor,
				backgroundColor: avatar.backgroundColor,
				text: "",
				empty: true,
				isChannel: false,
				decrypt: false,
			});
		}
	}
	catch (error: any) {
		console.log(error.message);
		return <ErrorProfile params={{id}}/>;
	}

	if (targetProfile.id !== -1)
		return (
				<ProfileMainFrame
					profile={targetProfile}
					avatar={avatar}
					isOwner={isProfilOwner}
					token={token}
					avatars={avatars}
				/>
		);
	else
		return <ErrorProfile params={{id}}/>;
}
