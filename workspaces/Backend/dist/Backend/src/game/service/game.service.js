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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const websockets_1 = require("@nestjs/websockets");
const Game_entity_1 = require("../../utils/typeorm/Game.entity");
const users_service_1 = require("../../users/users.service");
const avatar_service_1 = require("../../avatar/avatar.service");
const pongUtils_1 = require("../../../../Shared/game/pongUtils");
const score_service_1 = require("../../score/service/score.service");
const crypto_1 = require("../../utils/crypto/crypto");
let GameService = exports.GameService = class GameService {
    constructor(gameRepository, scoreService, usersService, avatarService, cryptoService) {
        this.gameRepository = gameRepository;
        this.scoreService = scoreService;
        this.usersService = usersService;
        this.avatarService = avatarService;
        this.cryptoService = cryptoService;
    }
    async getGameById(gameId) {
        try {
            const game = await this.gameRepository.findOne({
                where: { id: gameId },
            });
            if (!game) {
                throw new Error('Game not found');
            }
            return game;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getAllRankedGames() {
        try {
            const games = await this.gameRepository.find({
                where: { status: (0, typeorm_2.In)(['Not Started', 'Stopped', 'Playing']), mode: "League" },
            });
            return games;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getGameByUserId(userId) {
        try {
            let game = await this.gameRepository.findOne({
                where: {
                    host: userId,
                    status: (0, typeorm_2.In)(['Not Started', 'Stopped', 'Playing']),
                },
            });
            if (game != null) {
                return game.id;
            }
            game = await this.gameRepository.findOne({
                where: {
                    opponent: userId,
                    status: (0, typeorm_2.In)(['Not Started', 'Stopped', 'Playing']),
                },
            });
            if (game != null) {
                return game.id;
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getCurrentGames() {
        try {
            const games = await this.gameRepository.find({
                where: { status: (0, typeorm_2.In)(['Not Started', 'Stopped', 'Playing']) },
            });
            return games;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async definePlayer(userId, side, host) {
        try {
            const player = {
                id: -1,
                name: 'Searching',
                color: { r: 0, g: 0, b: 0, a: 0 },
                avatar: {
                    image: '',
                    text: '...',
                    variant: 'circular',
                    borderColor: '#000000',
                    backgroundColor: '#ff253a',
                    empty: false,
                    decrypt: false,
                },
                side: side,
                host: host,
            };
            const user = await this.usersService.getUserById(userId);
            if (!user) {
                return player;
            }
            const avatar = await this.avatarService.getAvatarById(userId, false);
            player.id = user.id;
            player.name = user.login;
            player.side = side;
            if (!avatar) {
                return player;
            }
            if ((avatar === null || avatar === void 0 ? void 0 : avatar.decrypt) && (avatar === null || avatar === void 0 ? void 0 : avatar.image.length) > 0) {
                avatar.image = await this.cryptoService.decrypt(avatar.image);
                avatar.decrypt = false;
            }
            player.color = (0, pongUtils_1.colorHexToRgb)(avatar.borderColor);
            player.avatar = avatar;
            return player;
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async checkOpponent(gameId) {
        try {
            const game = await this.gameRepository.findOne({
                where: { id: gameId },
            });
            if (!game) {
                throw new websockets_1.WsException('Game not found');
            }
            return game.opponent;
        }
        catch (error) {
            throw new websockets_1.WsException(error.message);
        }
    }
    async createGame(game) {
        try {
            const newGame = await this.gameRepository.save(game);
            const newScore = {
                gameId: newGame.id,
                mode: newGame.mode,
                leftPlayerId: newGame.hostSide == 'Left' ? newGame.host : newGame.opponent,
                rightPlayerId: newGame.hostSide == 'Right' ? newGame.host : newGame.opponent,
            };
            const score = await this.scoreService.createScore(newScore);
            await this.updateGameScore(newGame, score);
            return newGame.id;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async addOpponent(gameId, opponentId) {
        try {
            const game = await this.gameRepository.findOne({
                where: { id: gameId },
            });
            if (!game) {
                throw new Error('Game not found');
            }
            game.opponent = opponentId;
            await this.gameRepository.save(game);
            await this.scoreService.addOpponent(gameId, opponentId);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async updateStatus(gameId, status, result, actualRound) {
        try {
            const game = await this.gameRepository.findOne({
                where: { id: gameId },
            });
            if (!game) {
                throw new Error('Game not found');
            }
            game.status = status;
            game.result = result;
            game.actualRound = actualRound;
            await this.gameRepository.save(game);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async quitGame(gameId, userId) {
        try {
            const game = await this.gameRepository.findOne({
                where: { id: gameId },
            });
            if (!game) {
                throw new Error('Game not found');
            }
            if (game.status === 'Playing' || game.status === 'Stopped') {
                game.status = 'Deleted';
                if (userId === game.host) {
                    game.result = 'Opponent';
                }
                else if (userId === game.opponent) {
                    game.result = 'Host';
                }
                else {
                    throw new Error('User not in game');
                }
            }
            else if (game.status === 'Not Started') {
                game.status = 'Deleted';
                game.result = 'Deleted';
            }
            else {
                throw new Error('Game already finnished');
            }
            await this.gameRepository.save(game);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async updateGameScore(game, score) {
        await this.gameRepository
            .createQueryBuilder()
            .relation(Game_entity_1.Game, 'score')
            .of(game.id)
            .set(score);
    }
};
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Game_entity_1.Game)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        score_service_1.ScoreService,
        users_service_1.UsersService,
        avatar_service_1.AvatarService,
        crypto_1.CryptoService])
], GameService);
//# sourceMappingURL=game.service.js.map