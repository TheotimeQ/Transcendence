import { Avatar } from "src/utils/typeorm/Avatar.entity";
export declare class getPongieDto {
    id: number;
    login: string;
    avatar: Avatar;
    isFriend: boolean;
    isInvited: boolean;
    hasInvited: boolean;
    isBlacklisted: boolean;
    hasBlacklisted: boolean;
}
