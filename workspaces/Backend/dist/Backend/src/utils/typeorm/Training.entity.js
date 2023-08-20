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
exports.Training = void 0;
const typeorm_1 = require("typeorm");
const Score_entity_1 = require("./Score.entity");
let Training = exports.Training = class Training {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Training.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Training.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Training.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Training.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Training.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Training.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Training.prototype, "side", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Score_entity_1.Score),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Score_entity_1.Score)
], Training.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Not Started' }),
    __metadata("design:type", String)
], Training.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Not Finished' }),
    __metadata("design:type", String)
], Training.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Training.prototype, "actualRound", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Training.prototype, "maxPoint", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Training.prototype, "maxRound", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Training.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Training.prototype, "push", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Training.prototype, "pause", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Training.prototype, "background", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Training.prototype, "ball", void 0);
exports.Training = Training = __decorate([
    (0, typeorm_1.Entity)()
], Training);
//# sourceMappingURL=Training.entity.js.map