import { User } from "./User.entity";
export declare class UserPongieRelation {
    relationId: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    pongieId: number;
    user: User;
    pongie: User;
    isFriend: boolean;
    isInvited: boolean;
    hasInvited: boolean;
    isBlacklisted: boolean;
    hasBlacklisted: boolean;
}
