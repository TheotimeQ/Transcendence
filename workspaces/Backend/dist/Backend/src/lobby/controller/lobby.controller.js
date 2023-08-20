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
exports.LobbyController = void 0;
const common_1 = require("@nestjs/common");
const lobby_service_1 = require("../service/lobby.service");
const public_decorator_1 = require("../../utils/decorators/public.decorator");
const CreateGame_dto_1 = require("../../game/dto/CreateGame.dto");
let LobbyController = exports.LobbyController = class LobbyController {
    constructor(lobbyService) {
        this.lobbyService = lobbyService;
    }
    Status() {
        return 'Working !';
    }
    CreateGame(req, game) {
        return this.lobbyService.CreateGame(req.user.id, game);
    }
    JoinGame(req, gameId) {
        return this.lobbyService.JoinGame(req.user.id, gameId);
    }
    GetAllGames(mode) {
        return this.lobbyService.GetAll(mode);
    }
    Quit(req) {
        return this.lobbyService.Quit(req.user.id);
    }
    IsInGame(req) {
        return this.lobbyService.IsInGame(req.user.id);
    }
    GetLeague() {
        return this.lobbyService.GetLeague();
    }
    Populate() {
        return this.lobbyService.Populate();
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "Status", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateGame_dto_1.CreateGameDTO]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "CreateGame", null);
__decorate([
    (0, common_1.Put)('join/:gameId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('gameId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "JoinGame", null);
__decorate([
    (0, common_1.Get)('getall/:mode?'),
    __param(0, (0, common_1.Param)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "GetAllGames", null);
__decorate([
    (0, common_1.Post)('quit'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "Quit", null);
__decorate([
    (0, common_1.Get)('isingame'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "IsInGame", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('getleague'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "GetLeague", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('pop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "Populate", null);
exports.LobbyController = LobbyController = __decorate([
    (0, common_1.Controller)('lobby'),
    __metadata("design:paramtypes", [lobby_service_1.LobbyService])
], LobbyController);
//# sourceMappingURL=lobby.controller.js.map