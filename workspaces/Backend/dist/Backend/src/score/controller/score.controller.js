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
exports.ScoreController = void 0;
const common_1 = require("@nestjs/common");
const score_service_1 = require("../service/score.service");
const UpdateScore_dto_1 = require("../dto/UpdateScore.dto");
let ScoreController = exports.ScoreController = class ScoreController {
    constructor(scoreService) {
        this.scoreService = scoreService;
    }
    async getScoreByGameId(gameId) {
        return this.scoreService.getScoreByGameId(gameId);
    }
    async updateScore(req, updateScore) {
    }
};
__decorate([
    (0, common_1.Get)('game/:gameId'),
    __param(0, (0, common_1.Param)('gameId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScoreController.prototype, "getScoreByGameId", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateScore_dto_1.UpdateScoreDTO]),
    __metadata("design:returntype", Promise)
], ScoreController.prototype, "updateScore", null);
exports.ScoreController = ScoreController = __decorate([
    (0, common_1.Controller)('score'),
    __metadata("design:paramtypes", [score_service_1.ScoreService])
], ScoreController);
//# sourceMappingURL=score.controller.js.map