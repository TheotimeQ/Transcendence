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
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Avatar_entity_1 = require("../utils/typeorm/Avatar.entity");
const Channel_entity_1 = require("../utils/typeorm/Channel.entity");
const UserChannelRelation_1 = require("../utils/typeorm/UserChannelRelation");
let ChannelService = exports.ChannelService = class ChannelService {
    constructor(channelRepository, avatarRepository, userChannelRelation) {
        this.channelRepository = channelRepository;
        this.avatarRepository = avatarRepository;
        this.userChannelRelation = userChannelRelation;
    }
    async getChannelByName(name, privateMsg) {
        if (privateMsg)
            return await this.channelRepository.findOne({
                where: { name: name, type: "privateMsg" },
                relations: ['avatar'],
            });
        return await this.channelRepository.findOne({
            where: { name: name, type: (0, typeorm_2.Not)("privateMsg") },
            relations: ['avatar'],
        });
    }
    async addChannel(channelName, type) {
        const channel = await this.getChannelByName(channelName, false);
        if (channel)
            return null;
        const avatar = await this.avatarRepository.save({
            name: channelName,
            image: '',
            text: '',
            variant: 'rounded',
            borderColor: '#22d3ee',
            backgroundColor: '#22d3ee',
            empty: true,
            isChannel: true,
            decrypt: false,
        });
        const newChannel = {
            name: channelName,
            avatar: avatar,
            type: type,
        };
        return await this.channelRepository.save(newChannel);
    }
    formatPrivateMsgChannelName(id1, id2) {
        const lower = id1 < id2 ? id1 : id2;
        const higher = id1 > id2 ? id1 : id2;
        return lower + ' ' + higher;
    }
    async getChannelbyName(name) {
        return await this.channelRepository.findOne({ where: { name: name } });
    }
    async getChannelById(id) {
        return await this.channelRepository.findOne({
            where: { id: id },
            relations: ['avatar'],
        });
    }
    async getChannelAvatar(id) {
        return await this.channelRepository.findOne({ where: { id: id }, relations: ["avatar"] });
    }
    async getChannelMessages(id) {
        return await this.channelRepository.findOne({ where: { id: id }, relations: ["messages", "messages.user", "messages.user.avatar"] });
    }
    async getChannelUsers(id) {
        return await this.channelRepository.findOne({
            where: { id: id },
            relations: ["users", "users.avatar"],
        });
    }
    async getChannelUsersRelations(id) {
        const channel = await this.channelRepository.findOne({
            where: { id: id }, relations: ["users", "users.avatar"]
        });
        const usersRelation = await this.userChannelRelation.find({
            where: { channelId: id }, relations: ["user", "user.avatar"]
        });
        return {
            channel: channel,
            usersRelation: usersRelation,
        };
    }
    async checkChanOpPrivilege(userId, channelId) {
        const relation = await this.getOneUserChannelRelation(userId, channelId);
        try {
            this.verifyPermissions(userId, channelId, relation);
            return {
                isChanOp: relation.isChanOp,
            };
        }
        catch (error) {
            return {
                isChanOp: false,
                error: error.message,
            };
        }
    }
    async updateChannelUserRelation(relation) {
        const rep = {
            success: false,
            message: ""
        };
        try {
            const { userId, channelId } = relation;
            await this.userChannelRelation
                .createQueryBuilder()
                .update(UserChannelRelation_1.UserChannelRelation)
                .set({
                isChanOp: relation.isChanOp,
                joined: relation.joined,
                invited: relation.invited,
                isBanned: relation.isBanned,
            })
                .where("userId = :userId AND channelId = :channelId", { userId, channelId })
                .execute();
            rep.success = true;
        }
        catch (e) {
            rep.message = e.message;
            rep.error = e;
        }
        return rep;
    }
    async updateChannelUsers(channel, user) {
        await this.channelRepository
            .createQueryBuilder()
            .relation(Channel_entity_1.Channel, "users")
            .of(channel.id)
            .add(user);
    }
    async getPrivatePongie(channelId, userId) {
        const channel = await this.getChannelUsers(channelId);
        if (!channel)
            return null;
        return channel.users.find(user => user.id !== userId);
    }
    async isUserInChannel(userId, channelId) {
        const relation = await this.userChannelRelation.findOne({
            where: { userId: userId, channelId: channelId, joined: true, isBanned: false }
        });
        return relation ? true : false;
    }
    async editRelation(chanOpId, channelInfos) {
        const rep = {
            success: false,
            message: ""
        };
        if (channelInfos.newRelation.joined === undefined
            && channelInfos.newRelation.invited === undefined
            && channelInfos.newRelation.isChanOp === undefined
            && channelInfos.newRelation.isBanned === undefined)
            throw new Error("need at least one property to edit channel relation");
        const relation = await this.userChannelRelation.findOne({
            where: { userId: channelInfos.userId, channelId: channelInfos.channelId }
        });
        if (!relation)
            throw new Error("can't find the user or the channel requested");
        if (channelInfos.newRelation.joined !== undefined) {
            relation.joined = channelInfos.newRelation.joined;
            rep.message += `\nchanOp[${chanOpId}]:put joined to ${channelInfos.newRelation.joined} of user[${channelInfos.userId}]`;
        }
        if (channelInfos.newRelation.isChanOp !== undefined) {
            relation.isChanOp = channelInfos.newRelation.isChanOp;
            rep.message += `\nchanOp[${chanOpId}]:put isChanOp to ${channelInfos.newRelation.isChanOp} of user[${channelInfos.userId}]`;
        }
        if (channelInfos.newRelation.invited !== undefined) {
            relation.invited = channelInfos.newRelation.invited;
            rep.message += `\nchanOp[${chanOpId}]:put invited to ${channelInfos.newRelation.invited} of user[${channelInfos.userId}]`;
        }
        if (channelInfos.newRelation.isBanned !== undefined) {
            relation.isBanned = channelInfos.newRelation.isBanned;
            rep.message += `\nchanOp[${chanOpId}]:put invited to ${channelInfos.newRelation.isBanned} of user[${channelInfos.userId}]`;
        }
        const repDatabase = await this.updateChannelUserRelation(relation);
        if (!repDatabase.success)
            throw new Error("Error occured while updating user channel relation in database : " + repDatabase.message);
        rep.success = true;
        return rep;
    }
    async getOneUserChannelRelation(userId, channelId) {
        return (await this.getChannelUsersRelations(channelId)).usersRelation.find((relation) => relation.userId === userId);
    }
    verifyPermissions(userId, channelId, relation) {
        if (!relation)
            throw new Error(`channel(id: ${channelId}) has no relation with user(id: ${userId})`);
        else if (relation.isBanned)
            throw new Error(`channel(id: ${channelId}) user(id: ${userId}) is banned`);
        else if (!relation.isChanOp)
            throw new Error(`channel(id: ${channelId}) user(id: ${userId}) channel operator privileges required`);
    }
    log(message) {
        const cyan = '\x1b[36m';
        const stop = '\x1b[0m';
        process.stdout.write(cyan + '[channel service]  ' + stop);
        console.log(message);
    }
    async saveLastMessage(channelId, message) {
        await this.channelRepository
            .createQueryBuilder()
            .relation(Channel_entity_1.Channel, 'lastMessage')
            .of(channelId)
            .set(message);
    }
};
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Channel_entity_1.Channel)),
    __param(1, (0, typeorm_1.InjectRepository)(Avatar_entity_1.Avatar)),
    __param(2, (0, typeorm_1.InjectRepository)(UserChannelRelation_1.UserChannelRelation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChannelService);
//# sourceMappingURL=channel.service.js.map