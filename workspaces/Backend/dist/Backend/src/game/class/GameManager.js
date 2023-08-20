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
var GameManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const Pong_1 = require("./Pong");
const UserInfo_1 = require("./UserInfo");
const Game_constants_1 = require("../../../../Shared/constants/Game.constants");
const game_service_1 = require("../service/game.service");
const colored_logger_1 = require("../colored-logger");
const score_service_1 = require("../../score/service/score.service");
const stats_service_1 = require("../../stats/service/stats.service");
let GameManager = exports.GameManager = GameManager_1 = class GameManager {
    constructor(gameService, scoreService, statsService, logger) {
        this.gameService = gameService;
        this.scoreService = scoreService;
        this.statsService = statsService;
        this.logger = logger;
        this.pongOnGoing = new Map();
        this.usersConnected = [];
        this.logger = new colored_logger_1.ColoredLogger(GameManager_1.name);
    }
    setServer(server) {
        this.server = server;
        setInterval(() => {
            this.checkConnexion();
        }, Game_constants_1.CHECK_INTERVAL);
    }
    async joinGame(gameId, userId, socket) {
        const game = this.pongOnGoing.get(gameId);
        if (!game) {
            try {
                return this.createPong(gameId, userId, socket);
            }
            catch (error) {
                this.logger.error(`Can't create Pong Session: ${error.message}`, 'joinGame', error);
                throw new websockets_1.WsException("Can't create Pong Session");
            }
        }
        let user = this.usersConnected.find((user) => user.id === userId && user.socket.id === socket.id);
        if (!user) {
            user = new UserInfo_1.UserInfo(userId, socket, gameId, false);
            this.usersConnected.push(user);
        }
        try {
            const data = await game.join(user);
            return data;
        }
        catch (error) {
            this.logger.error(`Error while joining game: ${error.message}`, 'joinGame', error);
            throw new websockets_1.WsException('Error while joining game');
        }
    }
    async playerAction(action, socket) {
        const pong = this.pongOnGoing.get(action.gameId);
        if (!pong) {
            throw new websockets_1.WsException('Game not found');
        }
        const user = this.usersConnected.find((user) => user.id === action.userId && user.socket.id === socket.id);
        if (!user) {
            throw new websockets_1.WsException('User not found');
        }
        user.pingSend = 0;
        return pong.playerAction(action);
    }
    updatePong(userId, socket) {
        const user = this.usersConnected.find((user) => user.id === userId && user.socket.id === socket.id);
        if (!user) {
            this.logger.error(`User with ID ${userId} not found`, 'updatePong');
            throw new websockets_1.WsException('User not found');
        }
        user.pingSend = 0;
    }
    async disconnect(userId, socket, manual) {
        try {
            const user = this.usersConnected.find((user) => user.id === userId && user.socket.id === socket.id);
            if (!user) {
                return;
            }
            const pong = this.pongOnGoing.get(user.gameId);
            if (!pong) {
                return;
            }
            await pong.disconnect(user, manual);
            this.usersConnected = this.usersConnected.filter((user) => user.id !== userId && user.socket.id !== socket.id);
            return { success: true, message: 'User disconnected' };
        }
        catch (error) {
            this.logger.error(`Error while disconnecting user: ${error.message}`, 'Manager - disconnect', error);
            throw new websockets_1.WsException('Error while disconnecting user');
        }
    }
    async createPong(gameId, userId, socket) {
        let pong = this.pongOnGoing.get(gameId);
        if (pong) {
            throw new websockets_1.WsException('Game already exists');
        }
        try {
            const game = await this.gameService.getGameById(gameId);
            const score = await this.scoreService.getScoreByGameId(game.id);
            pong = new Pong_1.Pong(this.server, gameId, game, this.gameService, this.scoreService, this.statsService, this.logger, score);
            await pong.initPlayer();
            this.pongOnGoing.set(gameId, pong);
            return this.joinGame(gameId, userId, socket);
        }
        catch (error) {
            this.logger.error(`Error while creating Pong Session: ${error.message}`, 'createPong', error);
            throw new websockets_1.WsException('Error while creating Pong Session');
        }
    }
    checkConnexion() {
        this.usersConnected.forEach((user) => {
            if ((user.isPlayer && user.pingSend >= Game_constants_1.PLAYER_PING) ||
                (!user.isPlayer && user.pingSend >= Game_constants_1.SPECTATOR_PING)) {
                this.logger.log(`User with ID ${user.id} disconnected`);
                this.disconnect(user.id, user.socket, false).catch((error) => {
                    this.logger.error(`Error while disconnecting user: ${error.message}`, 'checkConnexion', error);
                });
            }
            else {
                user.sendPing();
            }
        });
    }
};
exports.GameManager = GameManager = GameManager_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_service_1.GameService,
        score_service_1.ScoreService,
        stats_service_1.StatsService,
        colored_logger_1.ColoredLogger])
], GameManager);
//# sourceMappingURL=GameManager.js.map