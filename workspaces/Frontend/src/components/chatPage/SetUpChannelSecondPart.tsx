import Avatar_Service from "@/services/Avatar.service";
import Channel_Service from "@/services/Channel.service";
import Profile_Service from "@/services/Profile.service";
import styleMain from "@/styles/chatPage/ChatDisplay.module.css";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import ChannelSecondPart from "../channel/ChannelSecondPart";
import LoadingSuspense from "../loading/LoadingSuspense";

type Props = {
  channelId: number;
  socket: Socket;
};

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

export default function SetUpSectionPongers({ channelId, socket }: Props): JSX.Element {
  const [channelRelation, setChannelRelation] =
    useState<ChannelUsersRelation | null>(null);
  const [me, setMe] = useState<UserRelation | null>(null);

  const getPongersData = async () => {
    const avatarService = new Avatar_Service(undefined);
    const channelService = new Channel_Service(undefined);
    const profileService = new Profile_Service(undefined);

    channelAndUsersRelation = await channelService.getChannelAndUsers(
      channelId
    );
    channelAndUsersRelation.channel.avatar =
      await avatarService.getChannelAvatarById(channelId);
    const myProfile = await profileService.getProfileByToken();

    const findStatus: UserRelation | undefined =
      channelAndUsersRelation.usersRelation.find(
        (relation) => relation.userId === myProfile.id
      );

    if (findStatus !== undefined) myRelation = findStatus;
    else myRelation.userId = myProfile.id;

    if (
      !channelAndUsersRelation ||
      !channelAndUsersRelation.channel ||
      !channelAndUsersRelation.channel.avatar ||
      channelAndUsersRelation.channel.id === -1 ||
      channelAndUsersRelation.channel.type === "privateMsg"
    )
      throw new Error("getPongersData user relation issue");

    setChannelRelation(channelAndUsersRelation);
    setMe(myRelation);
  };

  useEffect(() => {
    try {
      getPongersData();
    } catch (err) {
      console.log("SetUpSectionPongers error : ", err);
    }
  }, []);

  if (me && channelRelation) {
    return (
      <div className={styleMain.main + " " + styleMain.noPadding}>
        <ChannelSecondPart
          channelAndUsersRelation={channelRelation}
          myRelation={me}
          socket={socket}
        />
      </div>
    );
  } else {
    return (
    <div className={styleMain.main + " " + styleMain.noPadding}>
      <LoadingSuspense />;
    </div>);
  }
}
