import { Channel } from 'src/utils/typeorm/Channel.entity';
import { User } from 'src/utils/typeorm/User.entity';
export declare class saveNewMsgDto {
    content: string;
    channel: Channel;
    user: User;
}
