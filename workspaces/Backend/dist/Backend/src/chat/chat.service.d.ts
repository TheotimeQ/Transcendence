import { ChannelService } from 'src/channels/channel.service';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'src/utils/crypto/crypto';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { UserPongieRelation } from 'src/utils/typeorm/UserPongieRelation';
import { Repository } from 'typeorm';
import { channelDto } from './dto/channel.dto';
import { Socket, Server } from 'socket.io';
import { newMsgDto } from './dto/newMsg.dto';
import { MessagesService } from 'src/messages/messages.service';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { getPongieDto } from './dto/getPongie.dto';
import { EditChannelRelationDto } from '@/channels/dto/EditChannelRelation.dto';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { ClearNotifDto } from './dto/clearNotif.dto';
import { NotifMessages } from '@/utils/typeorm/NotifMessages.entity';
export declare class ChatService {
    private readonly userRepository;
    private readonly channelRepository;
    private readonly userPongieRelation;
    private readonly userChannelRelation;
    private readonly socketTokenRepository;
    private readonly notifRepository;
    private readonly notifMessagesRepository;
    private readonly usersService;
    private readonly channelService;
    private readonly messageService;
    private readonly cryptoService;
    constructor(userRepository: Repository<User>, channelRepository: Repository<Channel>, userPongieRelation: Repository<UserPongieRelation>, userChannelRelation: Repository<UserChannelRelation>, socketTokenRepository: Repository<SocketToken>, notifRepository: Repository<Notif>, notifMessagesRepository: Repository<NotifMessages>, usersService: UsersService, channelService: ChannelService, messageService: MessagesService, cryptoService: CryptoService);
    saveToken(token: string, userId: number): Promise<void>;
    getNotif(userId: number): Promise<Notif>;
    getNotifMsg(userId: number): Promise<NotifMessages[]>;
    clearNotif(userId: number, toClear: ClearNotifDto, userSockets: Socket[], server: Server): Promise<void>;
    getLoginWithAvatar(userId: number): Promise<{
        login: string;
        avatar: import("../utils/typeorm/Avatar.entity").Avatar;
    }>;
    getChannels(id: number): Promise<{
        joined: boolean;
        invited: boolean;
        isBanned: boolean;
        isChanop: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        users: User[];
        userChannelRelations: UserChannelRelation[];
        avatar: import("../utils/typeorm/Avatar.entity").Avatar;
        type: "public" | "protected" | "private" | "privateMsg";
        messages: import("../utils/typeorm/Message.entity").Message[];
        lastMessage: import("../utils/typeorm/Message.entity").Message;
    }[]>;
    getChannel(channelId: number, userId: number, userSockets: Socket[], server: Server): Promise<{
        success: boolean;
        error: string;
        channel: {
            joined: boolean;
            isBanned: boolean;
            invited: boolean;
            isChanOp: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            users: User[];
            userChannelRelations: UserChannelRelation[];
            avatar: import("../utils/typeorm/Avatar.entity").Avatar;
            type: "public" | "protected" | "private" | "privateMsg";
            messages: import("../utils/typeorm/Message.entity").Message[];
            lastMessage: import("../utils/typeorm/Message.entity").Message;
        };
    }>;
    getAllChannels(id: number): Promise<channelDto[]>;
    getAllPongies(id: number): Promise<getPongieDto[]>;
    getPongie(userId: number, pongieId: number): Promise<{
        error: string;
        id?: undefined;
        login?: undefined;
        avatar?: undefined;
        isFriend?: undefined;
        isInvited?: undefined;
        hasInvited?: undefined;
        isBlacklisted?: undefined;
        hasBlacklisted?: undefined;
    } | {
        id: number;
        login: string;
        avatar: import("../utils/typeorm/Avatar.entity").Avatar;
        isFriend: boolean;
        isInvited: boolean;
        hasInvited: boolean;
        isBlacklisted: boolean;
        hasBlacklisted: boolean;
        error?: undefined;
    }>;
    getPongies(id: number, blacklisted: boolean): Promise<getPongieDto[]>;
    deletePongie(userId: number, pongieId: number, pongieSockets: Socket[], userSockets: Socket[], server: Server): Promise<{
        success: boolean;
    }>;
    cancelInvitation(userId: number, pongieId: number, pongieSockets: Socket[], userSockets: Socket[], server: Server): Promise<{
        success: boolean;
    }>;
    cancelBlacklist(userId: number, pongieId: number, pongieSockets: Socket[], userSockets: Socket[], server: Server): Promise<{
        success: boolean;
    }>;
    blacklist(userId: number, pongieId: number, pongieSockets: Socket[], userSockets: Socket[], server: Server): Promise<{
        success: boolean;
    }>;
    addChannel(userId: number, channelId: number): Promise<void>;
    getChannelUsers(channelId: number): Promise<User[]>;
    getChannelById(channelId: number): Promise<Channel>;
    getMessages(channelId: number): Promise<Channel>;
    addPongie(userId: number, pongieId: number, pongieSockets: Socket[], userSockets: Socket[], server: Server): Promise<{
        success: boolean;
        error: string;
        msg: string;
    } | {
        success: string;
        error: string;
        msg: string;
    }>;
    joinChannel(userId: number, channelId: number, channelName: string, channelType: 'public' | 'protected' | 'private' | 'privateMsg', userSockets: Socket[], server: Server): Promise<{
        success: boolean;
        exists: boolean;
        banned: boolean;
        channel: {
            joined: boolean;
            isBanned: boolean;
            invited: boolean;
            isChanOp: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            users: User[];
            userChannelRelations: UserChannelRelation[];
            avatar: import("../utils/typeorm/Avatar.entity").Avatar;
            type: "public" | "protected" | "private" | "privateMsg";
            messages: import("../utils/typeorm/Message.entity").Message[];
            lastMessage: import("../utils/typeorm/Message.entity").Message;
        };
    }>;
    joinPongie(userId: number, pongieId: number, userSockets: Socket[], pongieSockets: Socket[]): Promise<{
        success: boolean;
        exists: boolean;
        banned: boolean;
        channel: {
            joined: boolean;
            isBanned: boolean;
            invited: boolean;
            isChanop: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            users: User[];
            userChannelRelations: UserChannelRelation[];
            avatar: import("../utils/typeorm/Avatar.entity").Avatar;
            type: "public" | "protected" | "private" | "privateMsg";
            messages: import("../utils/typeorm/Message.entity").Message[];
            lastMessage: import("../utils/typeorm/Message.entity").Message;
        };
    }>;
    leave(userId: number, channelId: number, socket: Socket, server: Server): Promise<void>;
    receiveNewMsg(message: newMsgDto, reqUserId: number, server: Server): Promise<void>;
    private receiveNewMsgNotif;
    joinAllMyChannels(socket: Socket, userId: number): Promise<void>;
    sendEditRelationNotif(infos: EditChannelRelationDto & {
        server: Server;
        from: number;
    }): Promise<void>;
    private sendServerNotifMsg;
    makeEditRelationNotifContent(infos: EditChannelRelationDto & {
        server: Server;
        from: number;
    }): Promise<string>;
    private log;
}
