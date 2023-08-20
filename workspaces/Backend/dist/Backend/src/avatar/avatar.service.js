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
exports.AvatarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const channel_service_1 = require("../channels/channel.service");
const users_service_1 = require("../users/users.service");
const Avatar_entity_1 = require("../utils/typeorm/Avatar.entity");
const typeorm_2 = require("typeorm");
let AvatarService = exports.AvatarService = class AvatarService {
    constructor(avatarRepository, usersService, channelService) {
        this.avatarRepository = avatarRepository;
        this.usersService = usersService;
        this.channelService = channelService;
    }
    async createAvatar(avatarDto) {
        return await this.avatarRepository.save(avatarDto);
    }
    async getAvatarById(id, isChannel) {
        try {
            if (!isChannel) {
                const avatar = (await this.usersService.getUserAvatar(id)).avatar;
                if (!avatar)
                    throw new common_1.NotFoundException('avatar not found');
                return avatar;
            }
            else {
                const avatar = (await this.channelService.getChannelAvatar(id)).avatar;
                if (!avatar)
                    throw new common_1.NotFoundException('avatar not found');
                return avatar;
            }
        }
        catch (error) {
            return undefined;
        }
    }
    async editUserAvatarColors(req, updateUserAvatarDto) {
        const rep = {
            success: false,
            message: '',
        };
        try {
            const avatar = (await this.usersService.getUserAvatar(req.user.id)).avatar;
            if (!avatar) {
                const defaultAvatar = this.createDefaultAvatar();
                rep.message = 'Avatar not found - default avatar created instead';
                if (!defaultAvatar)
                    rep.message = 'Avatar not found, then failed default avatar creation';
            }
            else {
                avatar.borderColor = updateUserAvatarDto.borderColor;
                avatar.backgroundColor = updateUserAvatarDto.backgroundColor;
                await this.avatarRepository.update(avatar.id, avatar);
                this.log(`user : ${req.user.login} - border color updated: ${updateUserAvatarDto.borderColor} - background color updated: ${updateUserAvatarDto.backgroundColor}`);
                rep.success = true;
                rep.message = 'Avatar colors successfully updated';
            }
        }
        catch (error) {
            rep.message = error.message;
            rep.error;
        }
        return rep;
    }
    async editChannelAvatarColors(req, updateUserAvatarDto) {
        const rep = {
            success: false,
            message: '',
        };
        try {
            const check = await this.channelService.checkChanOpPrivilege(req.user.id, updateUserAvatarDto.isChannel);
            if (!check.isChanOp)
                throw new Error(rep.error);
            const avatar = (await (this.channelService.getChannelAvatar(updateUserAvatarDto.isChannel))).avatar;
            if (!avatar)
                throw new Error(`error while fetching avatar of channel(id: ${updateUserAvatarDto.isChannel})`);
            avatar.borderColor = updateUserAvatarDto.borderColor;
            avatar.backgroundColor = updateUserAvatarDto.backgroundColor;
            await this.avatarRepository.update(avatar.id, avatar);
            this.log(`channel(id: ${updateUserAvatarDto.isChannel}) avatar updated by user : ${req.user.login} - border color updated: ${updateUserAvatarDto.borderColor} - background color updated: ${updateUserAvatarDto.backgroundColor}`);
            rep.success = true;
            rep.message = `channel(id: ${updateUserAvatarDto.isChannel}) avatar updated by user : ${req.user.login} - border color updated: ${updateUserAvatarDto.borderColor} - background color updated: ${updateUserAvatarDto.backgroundColor}`;
        }
        catch (error) {
            rep.message = error.message;
            rep.error = error;
        }
        return rep;
    }
    async createDefaultAvatar() {
        const avatar = {
            image: '',
            text: '',
            variant: 'circular',
            borderColor: '#22d3ee',
            backgroundColor: '#22d3ee',
            empty: true,
            decrypt: false,
        };
        return await this.avatarRepository.save(avatar);
    }
    log(message) {
        const cyan = '\x1b[36m';
        const stop = '\x1b[0m';
        process.stdout.write(cyan + '[Avatar service]  ' + stop);
        console.log(message);
    }
};
exports.AvatarService = AvatarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Avatar_entity_1.Avatar)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        channel_service_1.ChannelService])
], AvatarService);
//# sourceMappingURL=avatar.service.js.map