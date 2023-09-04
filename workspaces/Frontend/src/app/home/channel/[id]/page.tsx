import ChannelMainFrame from "@/components/channel/ChannelMainFrame";
import ErrorChannel from "@/components/channel/ErrorChannel";
import { Refresher } from "@/components/refresher/Refresher";
import Avatar_Service from "@/services/Avatar.service";
import Channel_Service from "@/services/Channel.service";
import Profile_Service from "@/services/Profile.service";
import styles from "@/styles/profile/Profile.module.css";
import { cookies } from "next/dist/client/components/headers";

type Params = {
  params: {
    id: number;
  };
};

export default async function ChannelprofilePage({ params: { id } }: Params) {
  let token: string = "";
  let myRelation: UserRelation = {
    userId: 0,
    isBoss: false,
    isChanOp: false,
    isBanned: false,
    joined: false,
    invited: false,
    muted: false,
    user: {
      id: 0,
      login: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      image: "",
      provider: "",
      motto: "",
      story: "",
      avatar: {
        image: "",
        variant: "",
        borderColor: "",
        backgroundColor: "",
        text: "",
        empty: true,
        isChannel: false,
        decrypt: false,
      },
    },
  };

  let channelAndUsersRelation: ChannelUsersRelation = {
    usersRelation: [],
    channel: {
      id: -1,
      name: "",
      type: "public",
      password: "",
      joined: false,
      isBanned: false,
      isBoss: false,
      isChanOp: false,
      invited: false,
      muted: false,
      avatar: {
        image: "",
        variant: "",
        borderColor: "",
        backgroundColor: "",
        text: "",
        empty: true,
        isChannel: false,
        decrypt: false,
      },
    },
  };

  try {
    const tryToken = cookies().get("crunchy-token")?.value;
    if (!tryToken) throw new Error("No token value");

    token = tryToken;

    const avatarService = new Avatar_Service(token);
    const channelService = new Channel_Service(token);
    const profileService = new Profile_Service(token);

    // [+] possible Pas en cascade les 3 await ?! + verifier si retourne undefined
    channelAndUsersRelation = await channelService.getChannelAndUsers(id);

    console.log(
      `CHECK => channel[${channelAndUsersRelation.channel.name}][${channelAndUsersRelation.channel.type}] => password = [${channelAndUsersRelation.channel.password}]`
    ); // checking

    channelAndUsersRelation.channel.avatar =
      await avatarService.getChannelAvatarById(id);
    const myProfile = await profileService.getProfileByToken();

    const findStatus: UserRelation | undefined =
      channelAndUsersRelation.usersRelation.find(
        (relation) => relation.userId === myProfile.id
      );

    if (findStatus !== undefined) myRelation = findStatus;
    else myRelation.userId = myProfile.id;

    if (findStatus && findStatus.isBanned)
      throw new Error("you are banned from this channel");

    if (
      (!findStatus || (!findStatus.isBoss && !findStatus.joined)) &&
      channelAndUsersRelation &&
      channelAndUsersRelation.channel.type === "private"
    )
      throw new Error("channel is private");
  } catch (err: any) {
    console.log(err); // checking

    if (err.message && typeof err.message === "string")
      return <ErrorChannel id={id} caughtErrorMsg={err.message} />;
    else return <ErrorChannel id={id} />;
  }

  if (
    !channelAndUsersRelation ||
    !channelAndUsersRelation.channel ||
    !channelAndUsersRelation.channel.avatar ||
    channelAndUsersRelation.channel.id === -1 ||
    channelAndUsersRelation.channel.type === "privateMsg"
  ) {
    // [+] Ajouter conditions dans le cas ou findStatus est undefined ou si myRelation.banned === true
    // [+] ajoutter des param a ErrorChanel, si private par ex
    return <ErrorChannel id={id} />;
  }

  return (
    <div className={styles.main}>
      <Refresher />
      <ChannelMainFrame
        token={token}
        channelAndUsersRelation={channelAndUsersRelation}
        myRelation={myRelation}
      />
    </div>
  );
}
