import Profile_Service from "@/services/Profile.service";
import ErrorProfile from "./ErrorProfile";
import ProfileMainFrame from "./ProfileMainFrame";
import styles from "@/styles/profile/Profile.module.css";
import { cookies } from "next/headers";
import Avatar_Service from "@/services/Avatar.service";
import { verifyAuth } from "@/lib/auth/auth";

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
				/>
		);
	else
		return <ErrorProfile params={{id}}/>;
}
