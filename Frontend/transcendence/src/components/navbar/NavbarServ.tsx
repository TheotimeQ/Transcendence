import { cookies, headers } from "next/dist/client/components/headers";
import Avatar_Service from "@/services/Avatar.service";

import NavbarFront from "./NavbarFront";
import Profile_Service from "@/services/Profile.service";

export default async function NavbarServ() {
  const url = headers().get('referer');
  let token: string | undefined;
  let avatar: Avatar = {
    image: "",
    name: "",
    variant: "circular",
    borderColor: "#22d3ee",
    backgroundColor: "#22d3ee",
    text: "",
    empty: true,
    isChannel: false,
    decrypt: false,
  };
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

  try {
    if (url?.includes("home") && !url.includes("create")) {
      token = cookies().get("crunchy-token")?.value;
      if (!token) throw new Error("No token value");

      const profileData = new Profile_Service(token);
      profile = await profileData.getProfileByToken();

      const Avatar = new Avatar_Service(token);
      avatar = await Avatar.getAvatarbyUserId(profile.id);
    }
  } catch (err) {
    console.log("NAVBAR error : ", err);
  }

  return <NavbarFront avatar={avatar} profile={profile} token={token} />;
}
