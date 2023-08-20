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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Channel_entity_1 = require("./Channel.entity");
const Avatar_entity_1 = require("./Avatar.entity");
const UserPongieRelation_1 = require("./UserPongieRelation");
const UserChannelRelation_1 = require("./UserChannelRelation");
const Token_entity_1 = require("./Token.entity");
const BackupCode_entity_1 = require("./BackupCode.entity");
const Stats_entity_1 = require("./Stats.entity");
const Notif_entity_1 = require("./Notif.entity");
let User = exports.User = User_1 = class User {
    async nullChecks() {
        if (!this.channels) {
            this.channels = [];
        }
        if (!this.pongies) {
            this.pongies = [];
        }
        if (!this.userPongieRelations) {
            this.userPongieRelations = [];
        }
        if (!this.pongieUserRelations) {
            this.pongieUserRelations = [];
        }
        if (!this.userChannelRelations) {
            this.userChannelRelations = [];
        }
        if (!this.tokens) {
            this.tokens = [];
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "passwordHashed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "verifyCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'bigint' }),
    __metadata("design:type", Number)
], User.prototype, "expirationCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "motto", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "story", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "trainingLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isTwoFactorAuthenticationEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "twoFactorAuthenticationSecret", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Channel_entity_1.Channel, (channel) => channel.users),
    (0, typeorm_1.JoinTable)({
        name: 'user_channel_relation',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'channelId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserChannelRelation_1.UserChannelRelation, (userChannelRelation) => userChannelRelation.channel),
    __metadata("design:type", Array)
], User.prototype, "userChannelRelations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1, (user) => user.pongies),
    (0, typeorm_1.JoinTable)({
        name: 'user_pongie_relation',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'pongieId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "pongies", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserPongieRelation_1.UserPongieRelation, (userPongieRelation) => userPongieRelation.pongie),
    __metadata("design:type", Array)
], User.prototype, "userPongieRelations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserPongieRelation_1.UserPongieRelation, (pongieUserRelation) => pongieUserRelation.pongie),
    __metadata("design:type", Array)
], User.prototype, "pongieUserRelations", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Avatar_entity_1.Avatar),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Avatar_entity_1.Avatar)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Notif_entity_1.Notif, { eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Notif_entity_1.Notif)
], User.prototype, "notif", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BackupCode_entity_1.BackupCode, (backupCode) => backupCode.user),
    __metadata("design:type", Array)
], User.prototype, "backupCodes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Token_entity_1.Token, (token) => token.user),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Stats_entity_1.Stats),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Stats_entity_1.Stats)
], User.prototype, "stats", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "nullChecks", null);
exports.User = User = User_1 = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=User.entity.js.map