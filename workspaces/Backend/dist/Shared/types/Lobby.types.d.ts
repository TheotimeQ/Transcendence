export type League = {
    Top10: PlayerLeaderBoard[];
    AllRanked: GameRanked[];
};
export type PlayerLeaderBoard = {
    login: string;
    score: number;
    rank: number;
    avatar: string;
    back: string;
    border: string;
};
export type GameRanked = {
    name: string;
    hostLogin: string;
    hostAvatarImage: string;
    hostAvatarBack: string;
    hostAvatarBorder: string;
    opponentLogin: string;
    opponentAvatarImage: string;
    opponentAvatarBack: string;
    opponentAvatarBorder: string;
    Type: string;
};
