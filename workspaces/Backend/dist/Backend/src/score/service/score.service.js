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
exports.ScoreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Score_entity_1 = require("../../utils/typeorm/Score.entity");
let ScoreService = exports.ScoreService = class ScoreService {
    constructor(scoreRepository) {
        this.scoreRepository = scoreRepository;
    }
    async createScore(newScore) {
        try {
            const score = await this.scoreRepository.save(newScore);
            return score;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async addOpponent(gameId, opponentId) {
        try {
            const score = await this.scoreRepository.findOne({
                where: { gameId: gameId },
            });
            if (!score) {
                throw new Error('Score not found');
            }
            if (score.leftPlayerId === -1) {
                console.log('Add Player to left Score');
                score.leftPlayerId = opponentId;
            }
            else if (score.rightPlayerId === -1) {
                console.log('Add Player to right Score');
                score.rightPlayerId = opponentId;
            }
            else {
                throw new Error('Both players already defined');
            }
            await this.scoreRepository.save(score);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getScoreByGameId(gameId) {
        try {
            const score = await this.scoreRepository.findOne({
                where: { gameId: gameId },
            });
            if (!score) {
                throw new Error('Score not found');
            }
            const scoreInfo = {
                id: score.id,
                leftRound: score.leftPlayerRoundWon,
                rightRound: score.rightPlayerRoundWon,
                round: [
                    {
                        left: score.leftPlayerRound1,
                        right: score.rightPlayerRound1,
                    },
                    {
                        left: score.leftPlayerRound2,
                        right: score.rightPlayerRound2,
                    },
                    {
                        left: score.leftPlayerRound3,
                        right: score.rightPlayerRound3,
                    },
                    {
                        left: score.leftPlayerRound4,
                        right: score.rightPlayerRound4,
                    },
                    {
                        left: score.leftPlayerRound5,
                        right: score.rightPlayerRound5,
                    },
                    {
                        left: score.leftPlayerRound6,
                        right: score.rightPlayerRound6,
                    },
                    {
                        left: score.leftPlayerRound7,
                        right: score.rightPlayerRound7,
                    },
                    {
                        left: score.leftPlayerRound8,
                        right: score.rightPlayerRound8,
                    },
                    {
                        left: score.leftPlayerRound9,
                        right: score.rightPlayerRound9,
                    },
                ],
                rageQuit: '',
                disconnect: '',
            };
            return scoreInfo;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async updateScore(gameId, scoreInfo, actualRound, changeRound) {
        try {
            const score = await this.scoreRepository.findOne({
                where: { gameId: gameId },
            });
            if (!score) {
                throw new Error('Score not found');
            }
            if (changeRound) {
                score.leftPlayerRoundWon = scoreInfo.leftRound;
                score.rightPlayerRoundWon = scoreInfo.rightRound;
                actualRound--;
            }
            switch (actualRound) {
                case 0:
                    score.leftPlayerRound1 = scoreInfo.round[0].left;
                    score.rightPlayerRound1 = scoreInfo.round[0].right;
                    break;
                case 1:
                    score.leftPlayerRound2 = scoreInfo.round[1].left;
                    score.rightPlayerRound2 = scoreInfo.round[1].right;
                    break;
                case 2:
                    score.leftPlayerRound3 = scoreInfo.round[2].left;
                    score.rightPlayerRound3 = scoreInfo.round[2].right;
                    break;
                case 3:
                    score.leftPlayerRound4 = scoreInfo.round[3].left;
                    score.rightPlayerRound4 = scoreInfo.round[3].right;
                    break;
                case 4:
                    score.leftPlayerRound5 = scoreInfo.round[4].left;
                    score.rightPlayerRound5 = scoreInfo.round[4].right;
                    break;
                case 5:
                    score.leftPlayerRound6 = scoreInfo.round[5].left;
                    score.rightPlayerRound6 = scoreInfo.round[5].right;
                    break;
                case 6:
                    score.leftPlayerRound7 = scoreInfo.round[6].left;
                    score.rightPlayerRound7 = scoreInfo.round[6].right;
                    break;
                case 7:
                    score.leftPlayerRound8 = scoreInfo.round[7].left;
                    score.rightPlayerRound8 = scoreInfo.round[7].right;
                    break;
                case 8:
                    score.leftPlayerRound9 = scoreInfo.round[8].left;
                    score.rightPlayerRound9 = scoreInfo.round[8].right;
            }
            await this.scoreRepository.save(score);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async updateRageQuit(gameId, rageQuit) {
        try {
            const score = await this.scoreRepository.findOne({
                where: { gameId: gameId },
            });
            if (!score) {
                throw new Error('Score not found');
            }
            score.rageQuit = rageQuit;
            await this.scoreRepository.save(score);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
};
exports.ScoreService = ScoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Score_entity_1.Score)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScoreService);
//# sourceMappingURL=score.service.js.map