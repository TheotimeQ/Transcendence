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
exports.ChannelController = void 0;
const common_1 = require("@nestjs/common");
const channel_service_1 = require("./channel.service");
const EditChannelRelation_dto_1 = require("./dto/EditChannelRelation.dto");
let ChannelController = exports.ChannelController = class ChannelController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    async getChannelById(req, id) {
        try {
            return await this.channelService.getChannelUsersRelations(id);
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async editRelation(req, newRelation) {
        let rep = {
            success: false,
            message: '',
        };
        try {
            const check = await this.channelService.checkChanOpPrivilege(req.user.id, newRelation.channelId);
            if (!check.isChanOp)
                throw new Error(check.error);
            rep = await this.channelService.editRelation(req.user.id, newRelation);
        }
        catch (error) {
            rep.success = false;
            rep.message = error.message;
        }
        return rep;
    }
};
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannelById", null);
__decorate([
    (0, common_1.Put)('editRelation'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, EditChannelRelation_dto_1.EditChannelRelationDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "editRelation", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.Controller)('channel'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService])
], ChannelController);
//# sourceMappingURL=channel.controller.js.map