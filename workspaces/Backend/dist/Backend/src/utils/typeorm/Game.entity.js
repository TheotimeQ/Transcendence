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
exports.Game = void 0;
const typeorm_1 = require("typeorm");
const Score_entity_1 = require("./Score.entity");
let Game = exports.Game = class Game {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Game.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Game.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Game.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Game.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Game.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Game.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Game.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: -1 }),
    __metadata("design:type", Number)
], Game.prototype, "opponent", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Game.prototype, "hostSide", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Score_entity_1.Score),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Score_entity_1.Score)
], Game.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Not Started' }),
    __metadata("design:type", String)
], Game.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Not Finished' }),
    __metadata("design:type", String)
], Game.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Game.prototype, "actualRound", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Game.prototype, "maxPoint", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Game.prototype, "maxRound", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Game.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Game.prototype, "push", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Game.prototype, "pause", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Game.prototype, "background", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Game.prototype, "ball", void 0);
exports.Game = Game = __decorate([
    (0, typeorm_1.Entity)()
], Game);
//# sourceMappingURL=Game.entity.js.map