import Avatar from "@mui/material/Avatar";

export default function AvatarUser({
  avatar,
  borderSize,
  backgroundColor,
  borderColor,
}: {
  avatar: Avatar;
  borderSize: string;
  backgroundColor: string;
  borderColor: string;
}) {
  return (
    <>
      {avatar.empty ? (
        <Avatar
          variant={avatar.variant as "circular" | "rounded"}
          sx={{
            width: "100%",
            height: "100%",
            borderWidth: borderSize,
            borderStyle: "solid",
            borderColor: `${borderColor}`,
            backgroundColor: `${backgroundColor}`,
          }}
        ></Avatar>
      ) : (
        <Avatar
          src={avatar.image}
          variant={avatar.variant as "circular" | "rounded"}
          sx={{
            width: "100%",
            height: "100%",
            borderWidth: borderSize,
            borderStyle: "solid",
            borderColor: `${borderColor}`,
            backgroundColor: `${backgroundColor}`,
          }}
        >
          {avatar.text}
        </Avatar>
      )}
    </>
  );
}
