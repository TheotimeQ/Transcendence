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
exports.AvatarController = void 0;
const common_1 = require("@nestjs/common");
const avatar_service_1 = require("./avatar.service");
const update_user_avatar_dto_1 = require("./dto/update-user-avatar.dto");
const users_service_1 = require("../users/users.service");
let AvatarController = exports.AvatarController = class AvatarController {
    constructor(avatarService, userService) {
        this.avatarService = avatarService;
        this.userService = userService;
    }
    async getAvatar(req) {
        const user = await this.userService.getUserAvatar(req.user.id);
        if (!user)
            return {
                exists: false,
            };
        console.log("[!] EST CE QU'ON UTILISE CE ENDPOINT ?");
        return user.avatar;
    }
    async getAvatarById(id, isChannel) {
        return this.avatarService.getAvatarById(id, isChannel);
    }
    async updateUserAvatar(req, updateUserAvatarDto) {
        return updateUserAvatarDto.isChannel > 0
            ? this.avatarService.editChannelAvatarColors(req, updateUserAvatarDto)
            : this.avatarService.editUserAvatarColors(req, updateUserAvatarDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Get)(':id/:isChannel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('isChannel', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "getAvatarById", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_avatar_dto_1.UpdateUserAvatarDto]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "updateUserAvatar", null);
exports.AvatarController = AvatarController = __decorate([
    (0, common_1.Controller)('avatar'),
    __metadata("design:paramtypes", [avatar_service_1.AvatarService,
        users_service_1.UsersService])
], AvatarController);
//# sourceMappingURL=avatar.controller.js.map