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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const channel_service_1 = require("../channels/channel.service");
const users_service_1 = require("../users/users.service");
const crypto_1 = require("../utils/crypto/crypto");
const Channel_entity_1 = require("../utils/typeorm/Channel.entity");
const User_entity_1 = require("../utils/typeorm/User.entity");
const UserChannelRelation_1 = require("../utils/typeorm/UserChannelRelation");
const UserPongieRelation_1 = require("../utils/typeorm/UserPongieRelation");
const typeorm_2 = require("typeorm");
const messages_service_1 = require("../messages/messages.service");
const SocketToken_entity_1 = require("../utils/typeorm/SocketToken.entity");
const Notif_entity_1 = require("../utils/typeorm/Notif.entity");
const NotifMessages_entity_1 = require("../utils/typeorm/NotifMessages.entity");
let ChatService = exports.ChatService = class ChatService {
    constructor(userRepository, channelRepository, userPongieRelation, userChannelRelation, socketTokenRepository, notifRepository, notifMessagesRepository, usersService, channelService, messageService, cryptoService) {
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.userPongieRelation = userPongieRelation;
        this.userChannelRelation = userChannelRelation;
        this.socketTokenRepository = socketTokenRepository;
        this.notifRepository = notifRepository;
        this.notifMessagesRepository = notifMessagesRepository;
        this.usersService = usersService;
        this.channelService = channelService;
        this.messageService = messageService;
        this.cryptoService = cryptoService;
    }
    async saveToken(token, userId) {
        try {
            const value = await this.cryptoService.encrypt(token);
            const tokenEntity = new SocketToken_entity_1.SocketToken();
            tokenEntity.value = value;
            tokenEntity.userId = userId;
            await this.socketTokenRepository.save(tokenEntity);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getNotif(userId) {
        try {
            const user = await this.usersService.getUserById(userId);
            if (!user)
                throw new websockets_1.WsException('no user found');
            return user.notif;
        }
        catch (error) {
            console.log(error.message);
            throw new websockets_1.WsException(error.message);
        }
    }
    async getNotifMsg(userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ["notif", "notif.notifMessages"],
            });
            if (!user)
                throw new websockets_1.WsException('no user found');
            return user.notif.notifMessages;
        }
        catch (error) {
            console.log(error.message);
            throw new websockets_1.WsException(error.message);
        }
    }
    async clearNotif(userId, toClear, userSockets, server) {
        try {
            const user = await this.usersService.getUserById(userId);
            if (!user)
                throw new websockets_1.WsException('no user found');
            if (toClear.which === "redPongies") {
                const updatedNotif = user.notif.redPongies.filter(id => id !== toClear.id);
                await this.notifRepository.update(user.notif.id, { redPongies: updatedNotif });
                if (userSockets.length !== 0) {
                    for (const socket of userSockets) {
                        server.to(socket.id).emit('notif', {
                            why: 'updatePongies',
                        });
                    }
                }
            }
            else if (toClear.which === "redChannels") {
                const updatedNotif = user.notif.redChannels.filter(id => id !== toClear.id);
                await this.notifRepository.update(user.notif.id, { redChannels: updatedNotif });
                if (userSockets.length !== 0) {
                    for (const socket of userSockets) {
                        server.to(socket.id).emit('notif', {
                            why: 'updateChannels',
                        });
                    }
                }
            }
            else if (toClear.which === "messages") {
                const notifUser = user.notif;
                const notif = await this.notifRepository.findOne({
                    where: { id: notifUser.id },
                    relations: ['notifMessages'],
                });
                const notifMsg = notif.notifMessages.find(notif => notif.channelId === toClear.id);
                if (notifMsg)
                    await this.notifMessagesRepository.remove(notifMsg);
                if (userSockets.length !== 0) {
                    for (const socket of userSockets) {
                        server.to(socket.id).emit('notifMsg');
                    }
                }
            }
        }
        catch (error) {
            console.log(error.message);
            throw new websockets_1.WsException(error.message);
        }
    }
    async getLoginWithAvatar(userId) {
        try {
            const user = await this.usersService.getUserAvatar(userId);
            if (!user)
                throw new Error('no user found');
            if (user.avatar.decrypt)
                user.avatar.image = await this.cryptoService.decrypt(user.avatar.image);
            return {
                login: user.login,
                avatar: user.avatar,
            };
        }
        catch (error) {
            console.log(error.message);
            throw new websockets_1.WsException(error.message);
        }
    }
    async getChannels(id) {
        try {
            const relations = await this.userChannelRelation.find({
                where: { userId: id, joined: true, isBanned: false },
                relations: [
                    'channel',
                    'channel.avatar',
                    'channel.lastMessage',
                    'channel.lastMessage.user',
                ],
            });
            if (!relations)
                return [];
            const channels = await Promise.all(relations.map(async (relation) => {
                const channel = relation.channel;
                let pongieId;
                if (channel.type === 'privateMsg') {
                    const ids = channel.name.split(' ');
                    if (id.toString() === ids[0])
                        pongieId = parseInt(ids[1]);
                    else
                        pongieId = parseInt(ids[0]);
                    const pongie = await this.usersService.getUserAvatar(pongieId);
                    if (!pongie)
                        throw new Error('no pongie found');
                    if (pongie.avatar.decrypt)
                        pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
                    channel.avatar = pongie.avatar;
                    channel.name = pongie.login;
                }
                return Object.assign(Object.assign({}, channel), { joined: relation.joined, invited: relation.invited, isBanned: relation.isBanned, isChanop: relation.isChanOp });
            }));
            return channels;
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async getChannel(channelId, userId, userSockets, server) {
        try {
            const user = await this.usersService.getUserChannels(userId);
            const channel = await this.channelService.getChannelById(channelId);
            if (!user || !channel)
                throw new Error('no channel or user found');
            let relation = await this.userChannelRelation.findOne({
                where: { channelId: channelId, userId: userId },
                relations: ["user", "channel"],
            });
            if (!relation) {
                await this.usersService.updateUserChannels(user, channel);
                relation = await this.userChannelRelation.findOne({
                    where: { channelId: channelId, userId: userId },
                    relations: ["user", "channel"]
                });
            }
            if (!relation)
                throw new Error('cannot create relation');
            if (relation.isBanned)
                return {
                    success: false,
                    error: 'banned',
                    channel: null,
                };
            if (channel.type === "privateMsg") {
                const ids = channel.name.split(" ");
                if (ids.length !== 2)
                    throw new Error("error in channel name");
                if (ids[0] === userId.toString()) {
                    const pongie = await this.usersService.getUserAvatar(parseInt(ids[1]));
                    if (pongie.avatar.decrypt)
                        pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
                    channel.avatar = pongie.avatar;
                    channel.name = pongie.login;
                }
                else {
                    const pongie = await this.usersService.getUserAvatar(parseInt(ids[0]));
                    if (pongie.avatar.decrypt)
                        pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
                    channel.avatar = pongie.avatar;
                    channel.name = pongie.login;
                }
            }
            if (!relation.joined && channel.type === "private")
                return {
                    success: false,
                    error: 'private',
                    channel: null,
                };
            if (!relation.joined && channel.type === "protected")
                return {
                    success: false,
                    error: 'protected',
                    channel: null,
                };
            if (channel.type !== "privateMsg") {
                const date = new Date();
                const msg = {
                    content: `${user.login} just arrived`,
                    date: date.toISOString(),
                    sender: null,
                    channelName: relation.channel.name,
                    channelId: channelId,
                    isServerNotif: true,
                };
                server.to('channel:' + channelId).emit('sendMsg', msg);
                'channel:' + channelId;
                server.to('channel:' + channelId).emit('notif', {
                    why: "updateChannels",
                });
            }
            if (userSockets.length >= 1) {
                for (const socket of userSockets) {
                    socket.join('channel:' + channel.id);
                }
            }
            const channelRelation = Object.assign(Object.assign({}, channel), { joined: true, isBanned: relation.isBanned, invited: relation.invited, isChanOp: relation.isChanOp });
            return {
                success: true,
                error: '',
                channel: channelRelation,
            };
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async getAllChannels(id) {
        try {
            const channels = await this.channelRepository.find({
                relations: ['avatar'],
                where: { type: (0, typeorm_2.Not)('privateMsg') },
            });
            const myRelations = await this.userChannelRelation.find({
                where: { userId: id },
                relations: ["channel"],
            });
            let all = channels.map((channel) => {
                let see = true;
                if (channel.type === 'private')
                    see = false;
                const myRelation = myRelations.find(relation => relation.channel.id === channel.id);
                if (myRelation)
                    return {
                        id: channel.id,
                        name: channel.name,
                        avatar: channel.avatar,
                        type: channel.type,
                        joined: myRelation.joined,
                        invited: myRelation.invited,
                        isBanned: myRelation.isBanned,
                        isChanOp: myRelation.isChanOp,
                    };
                if (see)
                    return {
                        id: channel.id,
                        name: channel.name,
                        avatar: channel.avatar,
                        type: channel.type,
                        joined: false,
                        invited: false,
                        isBanned: false,
                        isChanOp: false,
                    };
                return null;
            });
            all = all.filter(channel => channel);
            return all;
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async getAllPongies(id) {
        try {
            let pongies = await this.userRepository.find({
                where: { verified: true },
                relations: ['avatar'],
            });
            pongies = pongies.filter((pongie) => pongie.id !== id);
            pongies = pongies.filter((pongie) => pongie.login && pongie.login !== '');
            const myPongies = await this.getPongies(id, false);
            let all = await Promise.all(pongies.map(async (pongie) => {
                var _a, _b, _c;
                const myPongie = myPongies.find((myPongie) => myPongie.id === pongie.id);
                if (myPongie) {
                    if (myPongie && myPongie.isBlacklisted)
                        return;
                    return {
                        id: myPongie.id,
                        login: myPongie.login,
                        avatar: myPongie.avatar,
                        isFriend: myPongie.isFriend,
                        isInvited: myPongie.isInvited,
                        hasInvited: myPongie.hasInvited,
                        isBlacklisted: myPongie.isBlacklisted,
                        hasBlacklisted: myPongie.hasBlacklisted,
                    };
                }
                if (((_a = pongie.avatar) === null || _a === void 0 ? void 0 : _a.decrypt) && ((_c = (_b = pongie.avatar) === null || _b === void 0 ? void 0 : _b.image) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                    pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
                }
                return {
                    id: pongie.id,
                    login: pongie.login,
                    avatar: pongie.avatar,
                    isFriend: false,
                    isInvited: false,
                    hasInvited: false,
                    isBlacklisted: false,
                    hasBlacklisted: false,
                };
            }));
            all = all.filter(pongie => pongie);
            return all;
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async getPongie(userId, pongieId) {
        var _a, _b, _c;
        try {
            const pongie = await this.userRepository.findOne({
                where: { verified: true, id: pongieId },
                relations: ['avatar'],
            });
            if (!pongie)
                return {
                    error: 'no pongie found',
                };
            if (((_a = pongie.avatar) === null || _a === void 0 ? void 0 : _a.decrypt) && ((_c = (_b = pongie.avatar) === null || _b === void 0 ? void 0 : _b.image) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
            }
            const myPongie = await this.userPongieRelation.findOne({
                where: { userId: userId, pongieId: pongieId },
            });
            if (myPongie) {
                if (myPongie.isBlacklisted)
                    return {
                        error: "blacklisted"
                    };
                return {
                    id: pongie.id,
                    login: pongie.login,
                    avatar: pongie.avatar,
                    isFriend: myPongie.isFriend,
                    isInvited: myPongie.isInvited,
                    hasInvited: myPongie.hasInvited,
                    isBlacklisted: myPongie.isBlacklisted,
                    hasBlacklisted: myPongie.hasBlacklisted,
                };
            }
            return {
                id: pongie.id,
                login: pongie.login,
                avatar: pongie.avatar,
                isFriend: false,
                isInvited: false,
                hasInvited: false,
                isBlacklisted: false,
                hasBlacklisted: false,
            };
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async getPongies(id, blacklisted) {
        try {
            const relations = await this.userPongieRelation.find({
                where: { userId: id },
                relations: ['pongie', 'pongie.avatar'],
            });
            if (!relations)
                return [];
            let all = await Promise.all(relations.map(async (relation) => {
                var _a, _b, _c;
                if (blacklisted && relation.isBlacklisted)
                    return;
                if (((_a = relation.pongie.avatar) === null || _a === void 0 ? void 0 : _a.decrypt) &&
                    ((_c = (_b = relation.pongie.avatar) === null || _b === void 0 ? void 0 : _b.image) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                    relation.pongie.avatar.image = await this.cryptoService.decrypt(relation.pongie.avatar.image);
                }
                return {
                    id: relation.pongieId,
                    login: relation.pongie.login,
                    avatar: relation.pongie.avatar,
                    isFriend: relation.isFriend,
                    isInvited: relation.isInvited,
                    hasInvited: relation.hasInvited,
                    isBlacklisted: relation.isBlacklisted,
                    hasBlacklisted: relation.hasBlacklisted,
                };
            }));
            all = all.filter(pongie => pongie);
            return all;
        }
        catch (error) {
            console.log(error);
            throw new websockets_1.WsException(error.message);
        }
    }
    async deletePongie(userId, pongieId, pongieSockets, userSockets, server) {
        try {
            const user = await this.usersService.getUserPongies(userId);
            const pongie = await this.usersService.getUserPongies(pongieId);
            if (!user || !pongie)
                throw new Error('no user found');
            let relationUser = await this.userPongieRelation.findOne({
                where: { userId: userId, pongieId: pongieId },
                relations: ['user', 'pongie'],
            });
            if (!relationUser) {
                await this.usersService.updateUserPongies(user, pongie);
                relationUser = await this.userPongieRelation.findOne({
                    where: { userId: userId, pongieId: pongieId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationUser)
                throw new Error('cannot create relation');
            let relationPongie = await this.userPongieRelation.findOne({
                where: { userId: pongieId, pongieId: userId },
                relations: ['user', 'pongie'],
            });
            if (!relationPongie) {
                await this.usersService.updateUserPongies(pongie, user);
                relationPongie = await this.userPongieRelation.findOne({
                    where: { userId: pongieId, pongieId: userId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationPongie)
                throw new Error('cannot create relation');
            relationUser.isFriend = false;
            relationPongie.isFriend = false;
            relationUser.isInvited = false;
            relationPongie.isInvited = false;
            relationUser.hasInvited = false;
            relationPongie.hasInvited = false;
            await this.userPongieRelation.save(relationUser);
            await this.userPongieRelation.save(relationPongie);
            const updatedRedPongies = pongie.notif.redPongies.filter(id => id !== user.id);
            await this.notifRepository.update(pongie.notif.id, { redPongies: updatedRedPongies });
            if (pongieSockets.length !== 0) {
                for (const socket of pongieSockets) {
                    server.to(socket.id).emit('notif', {
                        why: 'updatePongies',
                    });
                }
            }
            if (userSockets.length !== 0) {
                for (const socket of userSockets) {
                    server.to(socket.id).emit('notif', {
                        why: 'updatePongies',
                    });
                }
            }
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error);
            throw new websockets_1.WsException('cannot delete pongie');
        }
    }
    async cancelInvitation(userId, pongieId, pongieSockets, userSockets, server) {
        try {
            const user = await this.usersService.getUserPongies(userId);
            const pongie = await this.usersService.getUserPongies(pongieId);
            if (!user || !pongie)
                throw new Error('no user found');
            let relationUser = await this.userPongieRelation.findOne({
                where: { userId: userId, pongieId: pongieId },
                relations: ['user', 'pongie'],
            });
            if (!relationUser) {
                await this.usersService.updateUserPongies(user, pongie);
                relationUser = await this.userPongieRelation.findOne({
                    where: { userId: userId, pongieId: pongieId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationUser)
                throw new Error("cannot create relation");
            let relationPongie = await this.userPongieRelation.findOne({
                where: { userId: pongieId, pongieId: userId },
                relations: ['user', 'pongie'],
            });
            if (!relationPongie) {
                await this.usersService.updateUserPongies(pongie, user);
                relationPongie = await this.userPongieRelation.findOne({
                    where: { userId: pongieId, pongieId: userId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationPongie)
                throw new Error("cannot create relation");
            relationUser.isInvited = false;
            relationPongie.isInvited = false;
            relationUser.hasInvited = false;
            relationPongie.hasInvited = false;
            await this.userPongieRelation.save(relationUser);
            await this.userPongieRelation.save(relationPongie);
            const updatedRedPongies = pongie.notif.redPongies.filter(id => id !== user.id);
            await this.notifRepository.update(pongie.notif.id, { redPongies: updatedRedPongies });
            if (pongieSockets.length !== 0) {
                for (const socket of pongieSockets) {
                    server.to(socket.id).emit('notif', {
                        "why": "updatePongies",
                    });
                }
            }
            if (userSockets.length !== 0) {
                for (const socket of userSockets) {
                    server.to(socket.id).emit('notif', {
                        "why": "updatePongies",
                    });
                }
            }
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error);
            throw new websockets_1.WsException('cannot delete pongie');
        }
    }
    async cancelBlacklist(userId, pongieId, pongieSockets, userSockets, server) {
        try {
            const user = await this.usersService.getUserPongies(userId);
            const pongie = await this.usersService.getUserPongies(pongieId);
            if (!user || !pongie)
                throw new Error('no user found');
            let relationUser = await this.userPongieRelation.findOne({
                where: { userId: userId, pongieId: pongieId },
                relations: ['user', 'pongie'],
            });
            if (!relationUser) {
                await this.usersService.updateUserPongies(user, pongie);
                relationUser = await this.userPongieRelation.findOne({
                    where: { userId: userId, pongieId: pongieId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationUser)
                throw new Error("cannot create relation");
            let relationPongie = await this.userPongieRelation.findOne({
                where: { userId: pongieId, pongieId: userId },
                relations: ['user', 'pongie'],
            });
            if (!relationPongie) {
                await this.usersService.updateUserPongies(pongie, user);
                relationPongie = await this.userPongieRelation.findOne({
                    where: { userId: pongieId, pongieId: userId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationPongie)
                throw new Error("cannot create relation");
            relationUser.hasBlacklisted = false;
            relationPongie.isBlacklisted = false;
            await this.userPongieRelation.save(relationUser);
            await this.userPongieRelation.save(relationPongie);
            if (pongieSockets.length !== 0) {
                for (const socket of pongieSockets) {
                    server.to(socket.id).emit('notif', {
                        "why": "updatePongies",
                    });
                }
            }
            if (userSockets.length !== 0) {
                for (const socket of userSockets) {
                    server.to(socket.id).emit('notif', {
                        "why": "updatePongies",
                    });
                }
            }
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error);
            throw new websockets_1.WsException('cannot delete pongie');
        }
    }
    async blacklist(userId, pongieId, pongieSockets, userSockets, server) {
        try {
            const user = await this.usersService.getUserPongies(userId);
            const pongie = await this.usersService.getUserPongies(pongieId);
            if (!user || !pongie)
                throw new Error('no user found');
            let relationUser = await this.userPongieRelation.findOne({
                where: { userId: userId, pongieId: pongieId },
                relations: ['user', 'pongie'],
            });
            if (!relationUser) {
                await this.usersService.updateUserPongies(user, pongie);
                relationUser = await this.userPongieRelation.findOne({
                    where: { userId: userId, pongieId: pongieId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationUser)
                throw new Error("cannot create relation");
            let relationPongie = await this.userPongieRelation.findOne({
                where: { userId: pongieId, pongieId: userId },
                relations: ['user', 'pongie'],
            });
            if (!relationPongie) {
                await this.usersService.updateUserPongies(pongie, user);
                relationPongie = await this.userPongieRelation.findOne({
                    where: { userId: pongieId, pongieId: userId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationPongie)
                throw new Error("cannot create relation");
            relationUser.hasBlacklisted = true;
            relationPongie.isBlacklisted = true;
            await this.userPongieRelation.save(relationUser);
            await this.userPongieRelation.save(relationPongie);
            if (pongieSockets.length !== 0) {
                for (const socket of pongieSockets) {
                    server.to(socket.id).emit('notif', {
                        "why": "updatePongies",
                    });
                }
            }
            if (userSockets.length !== 0) {
                for (const socket of userSockets) {
                    server.to(socket.id).emit('notif', {
                        "why": "updatePongies",
                    });
                }
            }
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error);
            throw new websockets_1.WsException('cannot delete pongie');
        }
    }
    async addChannel(userId, channelId) {
        try {
            const relation = await this.userChannelRelation.findOne({
                where: { userId: userId, channelId: channelId },
                relations: ['user', 'channel'],
            });
            if (!relation) {
                const user = await this.usersService.getUserPongies(userId);
                const channel = await this.channelService.getChannelById(channelId);
                await this.usersService.updateUserChannels(user, channel);
            }
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async getChannelUsers(channelId) {
        return (await this.channelService.getChannelUsers(channelId)).users;
    }
    async getChannelById(channelId) {
        return await this.channelService.getChannelById(channelId);
    }
    async getMessages(channelId) {
        try {
            const channel = await this.channelService.getChannelMessages(channelId);
            channel.messages = await Promise.all(channel.messages.map(async (message) => {
                if (message.user.avatar.decrypt) {
                    message.user.avatar.image = await this.cryptoService.decrypt(message.user.avatar.image);
                }
                return message;
            }));
            return channel;
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async addPongie(userId, pongieId, pongieSockets, userSockets, server) {
        try {
            const user = await this.usersService.getUserPongies(userId);
            const pongie = await this.usersService.getUserPongies(pongieId);
            if (!user || !pongie)
                throw new Error('no user found');
            let relationUser = await this.userPongieRelation.findOne({
                where: { userId: userId, pongieId: pongieId },
                relations: ['user', 'pongie'],
            });
            if (!relationUser) {
                await this.usersService.updateUserPongies(user, pongie);
                relationUser = await this.userPongieRelation.findOne({
                    where: { userId: userId, pongieId: pongieId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationUser)
                throw new Error('cannot create relation');
            if (relationUser.isBlacklisted)
                return {
                    success: true,
                    error: 'isBlacklisted',
                    msg: '',
                };
            let relationPongie = await this.userPongieRelation.findOne({
                where: { userId: pongieId, pongieId: userId },
                relations: ['user', 'pongie'],
            });
            if (!relationPongie) {
                await this.usersService.updateUserPongies(pongie, user);
                relationPongie = await this.userPongieRelation.findOne({
                    where: { userId: pongieId, pongieId: userId },
                    relations: ['user', 'pongie'],
                });
            }
            if (!relationPongie)
                throw new Error('cannot create relation');
            if (relationPongie.hasBlacklisted) {
                relationUser.isBlacklisted = true;
                await this.userPongieRelation.save(relationUser);
                return {
                    success: true,
                    error: 'isBlacklisted',
                    msg: '',
                };
            }
            if (relationPongie.hasInvited || relationUser.isInvited) {
                relationUser.isFriend = true;
                relationPongie.isFriend = true;
                relationUser.isInvited = false;
                relationPongie.isInvited = false;
                relationUser.hasInvited = false;
                relationPongie.hasInvited = false;
                await this.userPongieRelation.save(relationUser);
                await this.userPongieRelation.save(relationPongie);
                await this.notifRepository.update(pongie.notif.id, { redPongies: [...pongie.notif.redPongies, user.id] });
                if (pongieSockets.length !== 0) {
                    for (const socket of pongieSockets) {
                        server.to(socket.id).emit('notif', {
                            why: 'updatePongies',
                        });
                    }
                }
                if (userSockets.length !== 0) {
                    for (const socket of userSockets) {
                        server.to(socket.id).emit('notif', {
                            why: 'updatePongies',
                        });
                    }
                }
                return {
                    success: 'true',
                    error: '',
                    msg: 'friend',
                };
            }
            relationUser.hasInvited = true;
            relationPongie.isInvited = true;
            await this.userPongieRelation.save(relationUser);
            await this.userPongieRelation.save(relationPongie);
            await this.notifRepository.update(pongie.notif.id, { redPongies: [...pongie.notif.redPongies, user.id] });
            if (pongieSockets.length !== 0) {
                for (const socket of pongieSockets) {
                    server.to(socket.id).emit('notif', {
                        why: 'updatePongies',
                    });
                }
            }
            if (userSockets.length !== 0) {
                for (const socket of userSockets) {
                    server.to(socket.id).emit('notif', {
                        why: 'updatePongies',
                    });
                }
            }
            return {
                success: true,
                error: '',
                msg: 'invited',
            };
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async joinChannel(userId, channelId, channelName, channelType, userSockets, server) {
        try {
            const user = await this.usersService.getUserChannels(userId);
            if (!user)
                throw new Error('no user found');
            let channel = await this.channelService.getChannelById(channelId);
            if (!channel) {
                channel = await this.channelService.addChannel(channelName, channelType);
                if (!channel)
                    return {
                        success: false,
                        exists: true,
                        banned: false,
                        channel: null,
                    };
            }
            let relation = await this.userChannelRelation.findOne({
                where: { userId: userId, channelId: channelId },
                relations: ['user', 'channel'],
            });
            if (!relation) {
                await this.usersService.updateUserChannels(user, channel);
                relation = await this.userChannelRelation.findOne({
                    where: { userId: userId, channelId: channel.id },
                    relations: ['user', 'channel'],
                });
            }
            if (relation.isBanned)
                return {
                    success: false,
                    exists: false,
                    banned: true,
                    channel: null,
                };
            if (!relation.joined) {
                relation.joined = true;
                await this.userChannelRelation.save(relation);
            }
            const date = new Date();
            const msg = {
                content: `${user.login} just arrived`,
                date: date.toISOString(),
                sender: null,
                channelName: relation.channel.name,
                channelId: channelId,
                isServerNotif: true,
            };
            server.to('channel:' + channelId).emit('sendMsg', msg);
            server.to('channel:' + channelId).emit('editRelation', { channelId: channelId,
                newRelation: {
                    joined: true,
                },
                userId: userId,
                senderId: userId });
            this.log(`user[${userId}] joined channel ${relation.channel.name}`);
            if (userSockets.length >= 1) {
                for (const socket of userSockets) {
                    socket.join('channel:' + channel.id);
                    socket.emit('notif', {
                        why: "updateChannels",
                    });
                }
            }
            const channelRelation = Object.assign(Object.assign({}, channel), { joined: true, isBanned: relation.isBanned, invited: relation.invited, isChanOp: relation.isChanOp });
            return {
                success: true,
                exists: false,
                banned: false,
                channel: channelRelation,
            };
        }
        catch (error) {
            throw new websockets_1.WsException(error.msg);
        }
    }
    async joinPongie(userId, pongieId, userSockets, pongieSockets) {
        try {
            const user = await this.usersService.getUserChannels(userId);
            const pongie = await this.usersService.getUserChannels(pongieId);
            if (!user || !pongie)
                throw new Error('no user found');
            const channelName = this.channelService.formatPrivateMsgChannelName(userId.toString(), pongieId.toString());
            let channel = await this.channelService.getChannelByName(channelName, true);
            if (!channel)
                channel = await this.channelService.addChannel(channelName, 'privateMsg');
            let relationUser = await this.userChannelRelation.findOne({
                where: { userId: userId, channelId: channel.id },
                relations: ['user', 'channel'],
            });
            if (!relationUser) {
                await this.usersService.updateUserChannels(user, channel);
                relationUser = await this.userChannelRelation.findOne({
                    where: { userId: userId, channelId: channel.id },
                    relations: ['user', 'channel'],
                });
            }
            let relationPongie = await this.userChannelRelation.findOne({
                where: { userId: pongie.id, channelId: channel.id },
                relations: ['user', 'channel'],
            });
            if (!relationPongie) {
                await this.usersService.updateUserChannels(pongie, channel);
                relationPongie = await this.userChannelRelation.findOne({
                    where: { userId: pongieId, channelId: channel.id },
                    relations: ['user', 'channel'],
                });
            }
            if (relationUser.isBanned || relationPongie.isBanned)
                return {
                    success: false,
                    exists: false,
                    banned: true,
                    channel: null,
                };
            if (!relationUser.joined) {
                relationUser.joined = true;
                await this.userChannelRelation.save(relationUser);
            }
            if (!relationPongie.joined) {
                relationPongie.joined = true;
                await this.userChannelRelation.save(relationPongie);
            }
            if (userSockets.length >= 1) {
                for (const socket of userSockets) {
                    socket.join('channel:' + channel.id);
                    socket.emit('notif', {
                        why: "updateChannels",
                    });
                }
            }
            if (pongieSockets.length >= 1) {
                for (const socket of pongieSockets) {
                    socket.join('channel:' + channel.id);
                    socket.emit('notif', {
                        why: "updateChannels",
                    });
                }
            }
            if (pongie.avatar.decrypt)
                pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
            channel.name = pongie.login;
            channel.avatar = pongie.avatar;
            const channelrelation = Object.assign(Object.assign({}, channel), { joined: true, isBanned: relationUser.isBanned, invited: relationUser.invited, isChanop: relationUser.isChanOp });
            return {
                success: true,
                exists: false,
                banned: false,
                channel: channelrelation,
            };
        }
        catch (error) {
            console.log(error.message);
            throw new websockets_1.WsException(error.message);
        }
    }
    async leave(userId, channelId, socket, server) {
        try {
            const relation = await this.userChannelRelation.findOne({
                where: { userId: userId, channelId: channelId },
                relations: ['user', 'channel'],
            });
            if (!relation)
                throw new Error('no relation found');
            relation.joined = false;
            await this.userChannelRelation.save(relation);
            socket.leave('channel:' + channelId);
            socket.emit('notif');
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async receiveNewMsg(message, reqUserId, server) {
        try {
            const now = new Date();
            const nowtoISOString = now.toISOString();
            const [fetchedChannel, sender] = await Promise.all([
                this.channelService.getChannelById(message.channelId),
                this.usersService.getUserAvatar(reqUserId),
            ]);
            await this.receiveNewMsgNotif(message.channelId, sender.id, server);
            if (sender.avatar.decrypt) {
                sender.avatar.image = await this.cryptoService.decrypt(sender.avatar.image);
            }
            const sendMsg = {
                content: message.content,
                date: nowtoISOString,
                sender: sender,
                channelName: fetchedChannel.name,
                channelId: fetchedChannel.id,
                isServerNotif: false,
            };
            this.log(`[${reqUserId}] sending : [${sendMsg.content}] to : [${fetchedChannel.name}]`);
            await this.messageService.addMessage(sendMsg);
            this.log(`message emit to room : 'channel:${sendMsg.channelId}'`);
            server.to('channel:' + sendMsg.channelId).emit('sendMsg', sendMsg);
            server.to('channel:' + sendMsg.channelId).emit('notif', {
                why: "updateChannels",
            });
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async receiveNewMsgNotif(channelId, userId, server) {
        try {
            const relations = await this.userChannelRelation.find({
                where: {
                    channelId: channelId,
                    userId: (0, typeorm_2.Not)(userId),
                    joined: true,
                    isBanned: false,
                },
                relations: ['user', 'user.notif'],
            });
            if (relations.length >= 1) {
                for (const relation of relations) {
                    const notifMessages = relation.user.notif.notifMessages.find(notif => notif.channelId === channelId);
                    if (notifMessages) {
                        await this.notifMessagesRepository.update(notifMessages.id, { nbMessages: notifMessages.nbMessages + 1 });
                    }
                    else {
                        const notifMessage = new NotifMessages_entity_1.NotifMessages();
                        notifMessage.channelId = channelId;
                        notifMessage.nbMessages = 1;
                        notifMessage.notif = relation.user.notif;
                        await this.notifMessagesRepository.save(notifMessage);
                    }
                }
            }
            server.to("channel:" + channelId).emit("notifMsg");
        }
        catch (error) {
            console.log(error);
        }
    }
    async joinAllMyChannels(socket, userId) {
        const relations = await this.userChannelRelation.find({
            where: { userId: userId, joined: true, isBanned: false },
        });
        relations.map((relation) => {
            socket.join('channel:' + relation.channelId);
        });
    }
    async sendEditRelationNotif(infos) {
        const content = await this.makeEditRelationNotifContent(infos);
        this.sendServerNotifMsg(infos.channelId, content, infos.server);
    }
    sendServerNotifMsg(channelId, content, server) {
        try {
            const now = new Date();
            const nowtoISOString = now.toISOString();
            const notif = {
                content: content,
                date: nowtoISOString,
                sender: undefined,
                channelName: '',
                channelId: channelId,
                isServerNotif: true,
            };
            server.to('channel:' + channelId).emit('sendMsg', notif);
        }
        catch (e) {
            this.log('Error : ' + e.message);
        }
    }
    async makeEditRelationNotifContent(infos) {
        let content = '';
        try {
            const isSelf = infos.from === infos.userId;
            const whoFrom = await this.usersService.getUserById(infos.from);
            const whotTo = isSelf
                ? whoFrom
                : await this.usersService.getUserById(infos.userId);
            if (!whoFrom)
                throw new Error("can't find the edit relation maker");
            if (!whotTo)
                throw new Error("can't find the edit relation target");
            let action;
            if (infos.newRelation.isChanOp === true) {
                action = 'grants channel Operator privilege';
            }
            else if (infos.newRelation.isChanOp === false) {
                action = 'removes channel Operator privilege';
            }
            else if (infos.newRelation.isBanned === true) {
                action = 'gives a ban penalty';
            }
            else if (infos.newRelation.isBanned === false) {
                action = 'removes the ban penalty';
            }
            else if (infos.newRelation.joined === true) {
                action = 'allows joinning channel';
            }
            else if (infos.newRelation.joined === false) {
                action = 'gives a channel kick';
            }
            else if (infos.newRelation.invited === true) {
                action = 'gives a channel invitation';
            }
            else if (infos.newRelation.invited === false) {
                action = 'cancels the channel invitation';
            }
            else {
                throw new Error('no relation boolean found');
            }
            if (isSelf)
                content = `${whoFrom.login} ${action} to itself`;
            else
                content = `${whoFrom.login} ${action} to ${whotTo.login}`;
        }
        catch (e) {
            this.log('makeEditRelationNotifContent() error : ' + e.message);
        }
        return content;
    }
    log(message) {
        const green = '\x1b[32m';
        const stop = '\x1b[0m';
        process.stdout.write(green + '[chat service]  ' + stop);
        console.log(message);
    }
};
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Channel_entity_1.Channel)),
    __param(2, (0, typeorm_1.InjectRepository)(UserPongieRelation_1.UserPongieRelation)),
    __param(3, (0, typeorm_1.InjectRepository)(UserChannelRelation_1.UserChannelRelation)),
    __param(4, (0, typeorm_1.InjectRepository)(SocketToken_entity_1.SocketToken)),
    __param(5, (0, typeorm_1.InjectRepository)(Notif_entity_1.Notif)),
    __param(6, (0, typeorm_1.InjectRepository)(NotifMessages_entity_1.NotifMessages)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        channel_service_1.ChannelService,
        messages_service_1.MessagesService,
        crypto_1.CryptoService])
], ChatService);
//# sourceMappingURL=chat.service.js.map