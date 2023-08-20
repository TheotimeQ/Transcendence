import { Repository } from "typeorm";
import { ChannelDto } from "./dto/Channel.dto";
import { Avatar } from "src/utils/typeorm/Avatar.entity";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { User } from "src/utils/typeorm/User.entity";
import { UserChannelRelation } from "src/utils/typeorm/UserChannelRelation";
import { Message } from "@/utils/typeorm/Message.entity";
import { EditChannelRelationDto } from "./dto/EditChannelRelation.dto";
type ChannelAndUsers = {
    channel: Channel;
    usersRelation: UserChannelRelation[];
};
export declare class ChannelService {
    private readonly channelRepository;
    private readonly avatarRepository;
    private readonly userChannelRelation;
    constructor(channelRepository: Repository<Channel>, avatarRepository: Repository<Avatar>, userChannelRelation: Repository<UserChannelRelation>);
    getChannelByName(name: string, privateMsg: boolean): Promise<Channel>;
    addChannel(channelName: string, type: 'public' | 'protected' | 'private' | 'privateMsg'): Promise<ChannelDto & Channel>;
    formatPrivateMsgChannelName(id1: string, id2: string): string;
    getChannelbyName(name: string): Promise<Channel>;
    getChannelById(id: number): Promise<Channel>;
    getChannelAvatar(id: number): Promise<Channel>;
    getChannelMessages(id: number): Promise<Channel>;
    getChannelUsers(id: number): Promise<Channel>;
    getChannelUsersRelations(id: number): Promise<ChannelAndUsers>;
    checkChanOpPrivilege(userId: number, channelId: number): Promise<{
        isChanOp: boolean;
        error?: string;
    }>;
    updateChannelUserRelation(relation: UserChannelRelation): Promise<ReturnData>;
    updateChannelUsers(channel: Channel, user: User): Promise<void>;
    getPrivatePongie(channelId: number, userId: number): Promise<User>;
    isUserInChannel(userId: number, channelId: number): Promise<boolean>;
    editRelation(chanOpId: number, channelInfos: EditChannelRelationDto): Promise<ReturnData>;
    private getOneUserChannelRelation;
    private verifyPermissions;
    private log;
    saveLastMessage(channelId: number, message: Message): Promise<void>;
}
export {};
