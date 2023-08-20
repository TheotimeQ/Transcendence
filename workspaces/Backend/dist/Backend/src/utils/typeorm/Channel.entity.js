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
exports.Channel = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./User.entity");
const Avatar_entity_1 = require("./Avatar.entity");
const UserChannelRelation_1 = require("./UserChannelRelation");
const Message_entity_1 = require("./Message.entity");
let Channel = exports.Channel = class Channel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Channel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Channel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Channel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_entity_1.User, (user) => user.channels),
    __metadata("design:type", Array)
], Channel.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserChannelRelation_1.UserChannelRelation, userChannelRelation => userChannelRelation.user),
    __metadata("design:type", Array)
], Channel.prototype, "userChannelRelations", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Avatar_entity_1.Avatar),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Avatar_entity_1.Avatar)
], Channel.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'public', nullable: false }),
    __metadata("design:type", String)
], Channel.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Message_entity_1.Message, (message) => message.channel),
    __metadata("design:type", Array)
], Channel.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Message_entity_1.Message),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Message_entity_1.Message)
], Channel.prototype, "lastMessage", void 0);
exports.Channel = Channel = __decorate([
    (0, typeorm_1.Entity)()
], Channel);
//# sourceMappingURL=Channel.entity.js.map