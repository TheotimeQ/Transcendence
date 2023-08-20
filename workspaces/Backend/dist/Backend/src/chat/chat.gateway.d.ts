import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { newMsgDto } from './dto/newMsg.dto';
import { User } from 'src/utils/typeorm/User.entity';
import { channelIdDto } from './dto/channelId.dto';
import { EditChannelRelationDto } from '@/channels/dto/EditChannelRelation.dto';
import { JoinDto } from './dto/join.dto';
import { ClearNotifDto } from './dto/clearNotif.dto';
export declare class ChatGateway implements OnModuleInit {
    private readonly chatService;
    constructor(chatService: ChatService);
    private connectedUsers;
    server: Server;
    onModuleInit(): void;
    receiveNewMsg(message: newMsgDto, req: any): Promise<void>;
    notif(payload: {
        why: string;
    }, req: any): Promise<void>;
    getNotif(req: any): Promise<import("../utils/typeorm/Notif.entity").Notif>;
    getNotifMsg(req: any): Promise<import("../utils/typeorm/NotifMessages.entity").NotifMessages[]>;
    clearNotif(req: any, toClear: ClearNotifDto): Promise<void>;
    getLoginWithAvatar(req: any): Promise<{
        login: string;
        avatar: import("../utils/typeorm/Avatar.entity").Avatar;
    }>;
    getChannel(req: any, channelId: number): Promise<{
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
            userChannelRelations: import("../utils/typeorm/UserChannelRelation").UserChannelRelation[];
            avatar: import("../utils/typeorm/Avatar.entity").Avatar;
            type: "public" | "protected" | "private" | "privateMsg";
            messages: import("../utils/typeorm/Message.entity").Message[];
            lastMessage: import("../utils/typeorm/Message.entity").Message;
        };
    }>;
    getChannels(req: any): Promise<{
        joined: boolean;
        invited: boolean;
        isBanned: boolean;
        isChanop: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        users: User[];
        userChannelRelations: import("../utils/typeorm/UserChannelRelation").UserChannelRelation[];
        avatar: import("../utils/typeorm/Avatar.entity").Avatar;
        type: "public" | "protected" | "private" | "privateMsg";
        messages: import("../utils/typeorm/Message.entity").Message[];
        lastMessage: import("../utils/typeorm/Message.entity").Message;
    }[]>;
    getAllChannels(req: any): Promise<import("./dto/channel.dto").channelDto[]>;
    getPongie(req: any, pongieId: number): Promise<{
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
    getPongies(userId: number): Promise<import("./dto/getPongie.dto").getPongieDto[]>;
    getAllPongies(req: any): Promise<import("./dto/getPongie.dto").getPongieDto[]>;
    addPongie(pongieId: number, req: any): Promise<{
        success: boolean;
        error: string;
        msg: string;
    } | {
        success: string;
        error: string;
        msg: string;
    }>;
    deletePongie(pongieId: number, req: any): Promise<{
        success: boolean;
    }>;
    cancelInvitation(pongieId: number, req: any): Promise<{
        success: boolean;
    }>;
    cancelBlacklist(pongieId: number, req: any): Promise<{
        success: boolean;
    }>;
    blacklist(pongieId: number, req: any): Promise<{
        success: boolean;
    }>;
    join(payload: JoinDto, req: any): Promise<{
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
            userChannelRelations: import("../utils/typeorm/UserChannelRelation").UserChannelRelation[];
            avatar: import("../utils/typeorm/Avatar.entity").Avatar;
            type: "public" | "protected" | "private" | "privateMsg";
            messages: import("../utils/typeorm/Message.entity").Message[];
            lastMessage: import("../utils/typeorm/Message.entity").Message;
        };
    } | {
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
            userChannelRelations: import("../utils/typeorm/UserChannelRelation").UserChannelRelation[];
            avatar: import("../utils/typeorm/Avatar.entity").Avatar;
            type: "public" | "protected" | "private" | "privateMsg";
            messages: import("../utils/typeorm/Message.entity").Message[];
            lastMessage: import("../utils/typeorm/Message.entity").Message;
        };
    }>;
    leave(channelId: number, req: any, socket: any): Promise<void>;
    getMessages(payload: channelIdDto): Promise<import("../utils/typeorm/Message.entity").Message[]>;
    getChannelName(payload: channelIdDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getChannelUsers(payload: channelIdDto): Promise<User[]>;
    sendEditRelationEvents(payload: EditChannelRelationDto, req: any): Promise<void>;
    private log;
}
