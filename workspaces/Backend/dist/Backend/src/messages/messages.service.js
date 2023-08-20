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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const channel_service_1 = require("../channels/channel.service");
const users_service_1 = require("../users/users.service");
const Message_entity_1 = require("../utils/typeorm/Message.entity");
const typeorm_2 = require("typeorm");
let MessagesService = exports.MessagesService = class MessagesService {
    constructor(messageRepository, channelService, userService) {
        this.messageRepository = messageRepository;
        this.channelService = channelService;
        this.userService = userService;
    }
    async addMessage(message) {
        const channel = await this.channelService.getChannelById(message.channelId);
        if (!channel || !message.sender)
            throw new websockets_1.WsException("Database can't find " + message.channelName);
        const newMsg = {
            content: message.content,
            channel: channel,
            user: message.sender,
        };
        const messageSaved = await this.messageRepository.save(newMsg);
        await this.channelService.saveLastMessage(channel.id, messageSaved);
    }
};
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        channel_service_1.ChannelService,
        users_service_1.UsersService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map