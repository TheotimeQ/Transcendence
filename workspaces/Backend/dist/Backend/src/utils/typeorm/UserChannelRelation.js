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
exports.UserChannelRelation = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./User.entity");
const Channel_entity_1 = require("./Channel.entity");
let UserChannelRelation = exports.UserChannelRelation = class UserChannelRelation {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserChannelRelation.prototype, "relationId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserChannelRelation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserChannelRelation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], UserChannelRelation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], UserChannelRelation.prototype, "channelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.userChannelRelations),
    __metadata("design:type", User_entity_1.User)
], UserChannelRelation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Channel_entity_1.Channel, (channel) => channel.userChannelRelations),
    __metadata("design:type", Channel_entity_1.Channel)
], UserChannelRelation.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserChannelRelation.prototype, "isBanned", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserChannelRelation.prototype, "isChanOp", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserChannelRelation.prototype, "invited", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserChannelRelation.prototype, "joined", void 0);
exports.UserChannelRelation = UserChannelRelation = __decorate([
    (0, typeorm_1.Entity)("user_channel_relation")
], UserChannelRelation);
//# sourceMappingURL=UserChannelRelation.js.map