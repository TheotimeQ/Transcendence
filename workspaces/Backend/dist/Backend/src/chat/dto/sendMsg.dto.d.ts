import { User } from 'src/utils/typeorm/User.entity';
export declare class sendMsgDto {
    content: string;
    date: string;
    sender: User;
    channelName: string;
    channelId: number;
    isServerNotif: boolean;
}
