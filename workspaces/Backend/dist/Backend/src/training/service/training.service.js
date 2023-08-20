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
exports.TrainingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Training_entity_1 = require("../../utils/typeorm/Training.entity");
const score_service_1 = require("../../score/service/score.service");
const crypto_1 = require("../../utils/crypto/crypto");
const users_service_1 = require("../../users/users.service");
const avatar_service_1 = require("../../avatar/avatar.service");
const Game_constants_1 = require("../../../../Shared/constants/Game.constants");
const initPong_1 = require("../../../../Shared/game/initPong");
const pongUtils_1 = require("../../../../Shared/game/pongUtils");
let TrainingService = exports.TrainingService = class TrainingService {
    constructor(trainingRepository, scoreService, cryptoService, usersService, avatarService) {
        this.trainingRepository = trainingRepository;
        this.scoreService = scoreService;
        this.cryptoService = cryptoService;
        this.usersService = usersService;
        this.avatarService = avatarService;
    }
    async createTraining(training) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const newTraining = await this.trainingRepository.save(training);
            const newScore = {
                gameId: newTraining.id,
                mode: 'Training',
                leftPlayerId: newTraining.side == 'Left' ? newTraining.player : Game_constants_1.AI_ID,
                rightPlayerId: newTraining.side == 'Right' ? newTraining.player : Game_constants_1.AI_ID,
            };
            const score = await this.scoreService.createScore(newScore);
            await this.updateTrainingScore(newTraining, score);
            ret.success = true;
            ret.message = 'Training created';
            ret.data = newTraining.id;
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    async getTrainingById(trainingId, userId) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const training = await this.trainingRepository.findOne({
                where: { id: trainingId },
            });
            if (!training) {
                ret.message = 'Training not found';
                return ret;
            }
            if (training.player != userId) {
                ret.message = 'You are not the owner of this training';
                return ret;
            }
            const score = await this.scoreService.getScoreByGameId(training.id);
            const trainingData = (0, initPong_1.initPong)({
                id: training.id,
                name: training.name,
                type: training.type,
                mode: 'Training',
                hostSide: training.side,
                actualRound: training.actualRound,
                maxPoint: training.maxPoint,
                maxRound: training.maxRound,
                difficulty: training.difficulty,
                push: training.push,
                pause: training.pause,
                background: training.background,
                ball: training.ball,
                score: score,
            });
            trainingData.playerLeft = await this.definePlayer('Left', training.side == 'Left' ? training.player : Game_constants_1.AI_ID, training.type);
            trainingData.playerRight = await this.definePlayer('Right', training.side == 'Right' ? training.player : Game_constants_1.AI_ID, training.type);
            ret.success = true;
            ret.message = 'Training found';
            ret.data = trainingData;
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    async isInTraining(userId) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const training = await this.trainingRepository.findOne({
                where: {
                    player: userId,
                    status: (0, typeorm_2.In)(['Not Started', 'Stopped', 'Playing']),
                },
            });
            if (training) {
                ret.success = true;
                ret.message = 'You are in a training';
                ret.data = training.id;
            }
            ret.message = 'You are not in a training';
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    async updateTraining(trainingId, userId, updates) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const training = await this.trainingRepository.findOne({
                where: { id: trainingId },
            });
            if (!training) {
                ret.message = 'Training not found';
                return ret;
            }
            if (training.player != userId) {
                ret.message = 'You are not the owner of this training';
                return ret;
            }
            training.status = updates.status;
            const result = updates.result === 'Host'
                ? 'Win'
                : updates.result === 'Opponent'
                    ? 'Lose'
                    : updates.result;
            training.result = result;
            training.actualRound = updates.actualRound;
            await this.trainingRepository.save(training);
            ret.success = true;
            ret.message = 'Training updated';
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    async quitTraining(trainingId, userId) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const training = await this.trainingRepository.findOne({
                where: { id: trainingId },
            });
            if (!training) {
                ret.message = 'Training not found';
                return ret;
            }
            if (training.player != userId) {
                ret.message = 'You are not the owner of this training';
                return ret;
            }
            training.status = 'Deleted';
            await this.trainingRepository.save(training);
            ret.success = true;
            ret.message = 'Training deleted';
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    async updateTrainingScore(training, score) {
        await this.trainingRepository
            .createQueryBuilder()
            .relation(Training_entity_1.Training, 'score')
            .of(training.id)
            .set(score);
    }
    async definePlayer(side, playerId, type) {
        if (playerId === Game_constants_1.AI_ID) {
            const AIPlayer = {
                id: -2,
                name: `Coach ${type}`,
                color: { r: 232, g: 26, b: 26, a: 1 },
                avatar: {
                    image: '',
                    variant: 'circular',
                    borderColor: '#e81a1a',
                    backgroundColor: '#e81a1a',
                    text: 'CO',
                    empty: true,
                    decrypt: false,
                },
                side: side === 'Left' ? 'Right' : 'Left',
                host: false,
            };
            return AIPlayer;
        }
        else {
            try {
                const user = await this.usersService.getUserById(playerId);
                const avatar = await this.avatarService.getAvatarById(playerId, false);
                if ((avatar === null || avatar === void 0 ? void 0 : avatar.decrypt) && (avatar === null || avatar === void 0 ? void 0 : avatar.image.length) > 0) {
                    avatar.image = await this.cryptoService.decrypt(avatar.image);
                    avatar.decrypt = false;
                }
                const player = {
                    id: playerId,
                    name: user.login,
                    color: (0, pongUtils_1.colorHexToRgb)(avatar.borderColor),
                    avatar: avatar,
                    side: side,
                    host: true,
                };
                return player;
            }
            catch (error) {
                throw new Error(error.message);
            }
        }
    }
};
exports.TrainingService = TrainingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Training_entity_1.Training)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        score_service_1.ScoreService,
        crypto_1.CryptoService,
        users_service_1.UsersService,
        avatar_service_1.AvatarService])
], TrainingService);
//# sourceMappingURL=training.service.js.map