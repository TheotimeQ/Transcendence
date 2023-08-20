import { User } from "./User.entity";
import { Channel } from "./Channel.entity";
export declare class UserChannelRelation {
    relationId: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    channelId: number;
    user: User;
    channel: Channel;
    isBanned: boolean;
    isChanOp: boolean;
    invited: boolean;
    joined: boolean;
}
