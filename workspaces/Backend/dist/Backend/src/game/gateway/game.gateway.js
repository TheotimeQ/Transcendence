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
exports.GameGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const wsJwt_guard_1 = require("../guard/wsJwt.guard");
const jsonwebtoken_1 = require("jsonwebtoken");
const game_service_1 = require("../service/game.service");
const GameManager_1 = require("../class/GameManager");
const colored_logger_1 = require("../colored-logger");
const Action_dto_1 = require("../dto/Action.dto");
let GameGateway = exports.GameGateway = class GameGateway {
    constructor(gameService, gameManager, logger) {
        this.gameService = gameService;
        this.gameManager = gameManager;
        this.logger = logger;
    }
    onModuleInit() {
        this.gameManager.setServer(this.server);
        this.server.on('connection', (socket) => {
            var _a;
            const token = (_a = socket.handshake.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            try {
                const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
                if (!payload.sub) {
                    socket.disconnect();
                    return;
                }
                this.logger.log(`User with ID ${payload.sub} connected to Game`, 'OnModuleInit - Connection');
                socket.on('disconnect', () => {
                    this.logger.log(`User with ID ${payload.sub} disconnected`, 'OnModuleInit - Disconnection');
                    try {
                        this.gameManager.disconnect(payload.sub, socket, false);
                    }
                    catch (error) {
                        this.logger.error(`Error while disconnecting user: ${error.message}`, 'OnModuleInit - Disconnection', error);
                    }
                    socket.disconnect();
                });
            }
            catch (error) {
                this.logger.error(error, 'OnModuleInit');
                socket.disconnect();
            }
        });
    }
    async joinGame(socket, req, gameId) {
        return await this.gameManager.joinGame(gameId, req.user.id, socket);
    }
    handleHeartbeat(userId, socket) {
        this.gameManager.updatePong(userId, socket);
    }
    handleAction(action, socket) {
        this.gameManager.playerAction(action, socket);
    }
    quitGame(socket, req) {
        this.gameManager.disconnect(req.user.id, socket, true);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "joinGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pong'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleHeartbeat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('action'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Action_dto_1.ActionDTO,
        socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleAction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('quit'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "quitGame", null);
exports.GameGateway = GameGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [`http://${process.env.HOST_IP}:3000`, 'http://localhost:3000'],
        },
        namespace: '/game',
        path: '/game/socket.io',
    }),
    (0, common_1.UseGuards)(wsJwt_guard_1.WsJwtGuard),
    __metadata("design:paramtypes", [game_service_1.GameService,
        GameManager_1.GameManager,
        colored_logger_1.ColoredLogger])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map