import { User } from './User.entity';
import { Avatar } from './Avatar.entity';
import { UserChannelRelation } from './UserChannelRelation';
import { Message } from './Message.entity';
export declare class Channel {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    users: User[];
    userChannelRelations: UserChannelRelation[];
    avatar: Avatar;
    type: 'public' | 'protected' | 'private' | 'privateMsg';
    messages: Message[];
    lastMessage: Message;
}
