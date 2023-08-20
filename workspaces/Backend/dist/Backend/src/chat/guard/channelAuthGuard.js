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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const channel_service_1 = require("../../channels/channel.service");
let ChannelAuthGuard = exports.ChannelAuthGuard = class ChannelAuthGuard {
    constructor(reflector, channelService) {
        this.reflector = reflector;
        this.channelService = channelService;
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const wsContext = context.switchToWs();
        const message = wsContext.getData();
        const channelId = message.channelId;
        const userId = req.user.id;
        return this.channelService.isUserInChannel(userId, channelId);
    }
};
exports.ChannelAuthGuard = ChannelAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        channel_service_1.ChannelService])
], ChannelAuthGuard);
//# sourceMappingURL=channelAuthGuard.js.map