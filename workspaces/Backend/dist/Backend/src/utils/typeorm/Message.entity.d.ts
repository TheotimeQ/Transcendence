import { Channel } from './Channel.entity';
import { User } from './User.entity';
export declare class Message {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    channel: Channel;
    user: User;
    isServerNotif: boolean;
}
