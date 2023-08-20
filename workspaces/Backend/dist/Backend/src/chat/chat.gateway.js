"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const wsJwt_guard_1 = require("./guard/wsJwt.guard");
const jsonwebtoken_1 = require("jsonwebtoken");
const chat_service_1 = require("./chat.service");
const newMsg_dto_1 = require("./dto/newMsg.dto");
const channelAuthGuard_1 = require("./guard/channelAuthGuard");
const channelId_dto_1 = require("./dto/channelId.dto");
const EditChannelRelation_dto_1 = require("../channels/dto/EditChannelRelation.dto");
const join_dto_1 = require("./dto/join.dto");
const clearNotif_dto_1 = require("./dto/clearNotif.dto");
let ChatGateway = exports.ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
        this.connectedUsers = new Map();
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            var _a;
            const token = (_a = socket.handshake.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            try {
                const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
                if (!payload.sub) {
                    socket.disconnect();
                    return;
                }
                this.connectedUsers.set(socket, payload.sub.toString());
                this.chatService.joinAllMyChannels(socket, payload.sub);
                this.chatService.saveToken(token, payload.sub);
                socket.on('disconnect', () => {
                    this.connectedUsers.delete(socket);
                    this.log(`User with ID ${payload.sub} disconnected`);
                });
                this.log('connected users = ');
                for (const connect of this.connectedUsers) {
                    console.log("Socket id: ", connect[0].id + " , user id : " + connect[1]);
                }
            }
            catch (error) {
                console.log(error);
                socket.disconnect();
            }
        });
    }
    async receiveNewMsg(message, req) {
        await this.chatService.receiveNewMsg(message, req.user.id, this.server);
    }
    async notif(payload, req) {
        if (!payload)
            throw new websockets_1.WsException('no argument for notif');
        for (const [key, val] of this.connectedUsers) {
            if (val === req.user.id.toString())
                this.server.to(key.id).emit('notif', payload);
        }
    }
    async getNotif(req) {
        return await this.chatService.getNotif(req.user.id);
    }
    async getNotifMsg(req) {
        return await this.chatService.getNotifMsg(req.user.id);
    }
    async clearNotif(req, toClear) {
        const userSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === req.user.id.toString())
                userSockets.push(key);
        }
        return await this.chatService.clearNotif(req.user.id, toClear, userSockets, this.server);
    }
    async getLoginWithAvatar(req) {
        return await this.chatService.getLoginWithAvatar(req.user.id);
    }
    async getChannel(req, channelId) {
        if (!channelId)
            throw new websockets_1.WsException('no channel id');
        const userSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === req.user.id.toString())
                userSockets.push(key);
        }
        return await this.chatService.getChannel(channelId, req.user.id, userSockets, this.server);
    }
    async getChannels(req) {
        return await this.chatService.getChannels(req.user.id);
    }
    async getAllChannels(req) {
        return await this.chatService.getAllChannels(req.user.id);
    }
    async getPongie(req, pongieId) {
        if (!pongieId)
            throw new websockets_1.WsException('no pongie id');
        return await this.chatService.getPongie(req.user.id, pongieId);
    }
    async getPongies(userId) {
        if (!userId)
            throw new websockets_1.WsException('no given id');
        return await this.chatService.getPongies(userId, true);
    }
    async getAllPongies(req) {
        return await this.chatService.getAllPongies(req.user.id);
    }
    async addPongie(pongieId, req) {
        if (!pongieId)
            throw new websockets_1.WsException('no pongie id');
        const pongieSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === pongieId.toString())
                pongieSockets.push(key);
        }
        const userSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === req.user.id.toString())
                userSockets.push(key);
        }
        return await this.chatService.addPongie(req.user.id, pongieId, pongieSockets, userSockets, this.server);
    }
    async deletePongie(pongieId, req) {
        if (!pongieId)
            throw new websockets_1.WsException('no pongie id');
        const pongieSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === pongieId.toString())
                pongieSockets.push(key);
        }
        const userSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === req.user.id.toString())
                userSockets.push(key);
        }
        return await this.chatService.deletePongie(req.user.id, pongieId, pongieSockets, userSockets, this.server);
    }
    async cancelInvitation(pongieId, req) {
        if (!pongieId)
            throw new websockets_1.WsException('no pongie id');
        const pongieSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === pongieId.toString())
                pongieSockets.push(key);
        }
        const userSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === req.user.id.toString())
                userSockets.push(key);
        }
        return await this.chatService.cancelInvitation(req.user.id, pongieId, pongieSockets, userSockets, this.server);
    }
    async cancelBlacklist(pongieId, req) {
        if (!pongieId)
            throw new websockets_1.WsException('no pongie id');
        const pongieSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === pongieId.toString())
                pongieSockets.push(key);
        }
        const userSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === req.user.id.toString())
                userSockets.push(key);
        }
        return await this.chatService.cancelBlacklist(req.user.id, pongieId, pongieSockets, userSockets, this.server);
    }
    async blacklist(pongieId, req) {
        if (!pongieId)
            throw new websockets_1.WsException('no pongie id');
        const pongieSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === pongieId.toString())
                pongieSockets.push(key);
        }
        const userSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === req.user.id.toString())
                userSockets.push(key);
        }
        return await this.chatService.blacklist(req.user.id, pongieId, pongieSockets, userSockets, this.server);
    }
    async join(payload, req) {
        const pongieSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === payload.id.toString())
                pongieSockets.push(key);
        }
        const userSockets = [];
        for (const [key, val] of this.connectedUsers) {
            if (val === req.user.id.toString())
                userSockets.push(key);
        }
        if (payload.channelType === 'privateMsg')
            return await this.chatService.joinPongie(req.user.id, payload.id, userSockets, pongieSockets);
        else
            return await this.chatService.joinChannel(req.user.id, payload.id, payload.channelName, payload.channelType, userSockets, this.server);
    }
    async leave(channelId, req, socket) {
        return await this.chatService.leave(req.user.id, channelId, socket, this.server);
    }
    async getMessages(payload) {
        return (await this.chatService.getMessages(payload.id)).messages;
    }
    async getChannelName(payload) {
        this.log(`'getChannelName' event, with channelId: ${payload.id}`);
        const channel = await this.chatService.getChannelById(payload.id);
        return {
            success: channel ? true : false,
            message: channel ? channel.name : '',
        };
    }
    async getChannelUsers(payload) {
        const id = payload.id;
        console.log('getChannelUsers proc --> ChannelId : ', id);
        const users = await this.chatService.getChannelUsers(payload.id);
        console.log(users);
        return users;
    }
    async sendEditRelationEvents(payload, req) {
        console.log("sendEditRelationEvents() reached - about channel id : " + payload.channelId);
        const updatedPayload1 = Object.assign(Object.assign({}, payload), { senderId: req.user.id });
        this.server.to("channel:" + payload.channelId).emit('editRelation', updatedPayload1);
        const updatedPayload2 = Object.assign(Object.assign({}, payload), { server: this.server, from: req.user.id });
        this.chatService.sendEditRelationNotif(updatedPayload2);
    }
    log(message) {
        const green = '\x1b[32m';
        const stop = '\x1b[0m';
        process.stdout.write(green + '[chat gateway]  ' + stop);
        console.log(message);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(channelAuthGuard_1.ChannelAuthGuard),
    (0, websockets_1.SubscribeMessage)('newMsg'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newMsg_dto_1.newMsgDto, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "receiveNewMsg", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('notif'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "notif", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getNotif'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getNotif", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getNotifMsg'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getNotifMsg", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('clearNotif'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, clearNotif_dto_1.ClearNotifDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "clearNotif", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getLoginWithAvatar'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getLoginWithAvatar", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getChannel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getChannels'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getChannels", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getAllChannels'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getAllChannels", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getPongie'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getPongie", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getPongies'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getPongies", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getAllPongies'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getAllPongies", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('addPongie'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "addPongie", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deletePongie'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "deletePongie", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('cancelInvitation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "cancelInvitation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('cancelBlacklist'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "cancelBlacklist", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('blacklist'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "blacklist", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_dto_1.JoinDto, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "join", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "leave", null);
__decorate([
    (0, common_1.UseGuards)(channelAuthGuard_1.ChannelAuthGuard),
    (0, websockets_1.SubscribeMessage)('getMessages'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channelId_dto_1.channelIdDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getMessages", null);
__decorate([
    (0, common_1.UseGuards)(channelAuthGuard_1.ChannelAuthGuard),
    (0, websockets_1.SubscribeMessage)('getChannelName'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channelId_dto_1.channelIdDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getChannelName", null);
__decorate([
    (0, common_1.UseGuards)(channelAuthGuard_1.ChannelAuthGuard),
    (0, websockets_1.SubscribeMessage)('getChannelUsers'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channelId_dto_1.channelIdDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getChannelUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('editRelation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditChannelRelation_dto_1.EditChannelRelationDto, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendEditRelationEvents", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, common_1.UseGuards)(wsJwt_guard_1.WsJwtGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [`http://${process.env.HOST_IP}:3000`, 'http://localhost:3000'],
        },
        namespace: '/chat',
        path: '/chat/socket.io',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map