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
exports.MatchmakingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Game_entity_1 = require("../../utils/typeorm/Game.entity");
const Matchmaking_dto_1 = require("../dto/Matchmaking.dto");
const Matchmaking_entity_1 = require("../../utils/typeorm/Matchmaking.entity");
const User_entity_1 = require("../../utils/typeorm/User.entity");
const game_service_1 = require("../../game/service/game.service");
let MatchmakingService = exports.MatchmakingService = class MatchmakingService {
    constructor(gameRepository, MatchMakeRepository, UserRepository, gameService) {
        this.gameRepository = gameRepository;
        this.MatchMakeRepository = MatchMakeRepository;
        this.UserRepository = UserRepository;
        this.gameService = gameService;
    }
    async MatchmakeStart(req) {
        try {
            if (await this.CheckIfAlreadyInGame(req.user.id)) {
                const Data = {
                    success: false,
                    message: 'You are already in a game',
                };
                return Data;
            }
            if (await this.CheckIfAlreadyInMatchmaking(req.user.id)) {
                const Data = {
                    success: false,
                    message: 'You are already in matchmaking',
                };
                return Data;
            }
            if (await this.AddPlayerToMatchmaking(req.user.id, req.body.type)) {
                const Data = {
                    success: true,
                    message: 'You are now in matchmaking ',
                };
                return Data;
            }
        }
        catch (error) {
            const Data = {
                success: false,
                message: 'Catched an error',
                error: error,
            };
            return Data;
        }
        const Data = {
            success: false,
            message: 'Case not handled',
        };
        return Data;
    }
    async MatchmakeStop(req) {
        try {
            if (!(await this.CheckIfAlreadyInMatchmaking(req.user.id))) {
                const Data = {
                    success: false,
                    message: 'You are not in matchmaking',
                };
                return Data;
            }
            if (await this.RemovePlayerFromMatchmaking(req.user.id)) {
                const Data = {
                    success: true,
                    message: 'You are not in matchmaking anymore',
                };
                return Data;
            }
        }
        catch (error) {
            const Data = {
                success: false,
                message: 'Catched an error',
                error: error,
            };
            return Data;
        }
        const Data = {
            success: false,
            message: 'Case not handled',
        };
        return Data;
    }
    async MatchmakeUpdate(req) {
        try {
            if (await this.CheckIfAlreadyInGame(req.user.id)) {
                const game = await this.GetGameId(req.user.id);
                const Data = {
                    success: true,
                    message: 'Game found',
                    data: {
                        id: game.id,
                    },
                };
                return Data;
            }
            if (!(await this.CheckIfAlreadyInMatchmaking(req.user.id))) {
                const Data = {
                    success: false,
                    message: 'You are not in matchmaking',
                };
                return Data;
            }
            const game_id = await this.CheckIfTwoPlayerAreInMatchmaking();
            if (game_id != false) {
                const Data = {
                    success: true,
                    message: 'Game created',
                    data: {
                        id: game_id,
                    },
                };
                return Data;
            }
            const Data = {
                success: true,
                message: 'Waiting for opponent',
            };
            return Data;
        }
        catch (error) {
            const Data = {
                success: false,
                message: 'Catched an error',
                error: error,
            };
            return Data;
        }
    }
    async CheckIfTwoPlayerAreInMatchmaking() {
        const all_user = await this.MatchMakeRepository.find();
        if (all_user != null) {
            if (all_user.length >= 2) {
                const user1 = all_user[0];
                const user2 = all_user[1];
                await this.MatchMakeRepository.remove(user1);
                await this.MatchMakeRepository.remove(user2);
                const name_1 = await this.GetPlayerName(user1.Player_Id);
                const name_2 = await this.GetPlayerName(user2.Player_Id);
                const createGameDTO = {
                    name: name_1 + ' vs ' + name_2,
                    type: 'Classic',
                    mode: 'League',
                    host: user1.Player_Id,
                    opponent: user2.Player_Id,
                    hostSide: 'Left',
                    maxPoint: 9,
                    maxRound: 1,
                    difficulty: 2,
                    push: false,
                    pause: false,
                    background: 'classic',
                    ball: 'classic',
                };
                try {
                    const gameId = await this.gameService.createGame(createGameDTO);
                    return gameId;
                }
                catch (error) {
                    return false;
                }
            }
        }
        return false;
    }
    async CheckIfAlreadyInMatchmaking(user_id) {
        if (user_id != null) {
            const user = await this.MatchMakeRepository.findOne({
                where: { Player_Id: user_id },
            });
            if (user != null) {
                return true;
            }
        }
        return false;
    }
    async GetGameId(user_id) {
        if (user_id != null) {
            let game = await this.gameRepository.findOne({
                where: {
                    host: user_id,
                    status: 'Not Started' || 'Stopped' || 'Playing',
                },
            });
            if (game != null) {
                return game;
            }
            game = await this.gameRepository.findOne({
                where: {
                    opponent: user_id,
                    status: 'Not Started' || 'Stopped' || 'Playing',
                },
            });
            if (game != null) {
                return game;
            }
        }
        return false;
    }
    async CheckIfAlreadyInGame(user_id) {
        if (user_id != null) {
            const host = await this.gameRepository.findOne({
                where: {
                    host: user_id,
                    status: 'Not Started' || 'Stopped' || 'Playing',
                },
            });
            if (host != null) {
                return true;
            }
            const opponent = await this.gameRepository.findOne({
                where: {
                    opponent: user_id,
                    status: 'Not Started' || 'Stopped' || 'Playing',
                },
            });
            if (opponent != null) {
                return true;
            }
        }
        return false;
    }
    async CheckIfPlayerIsInMatchmaking(user_id) {
        if (user_id != null) {
            const user = await this.MatchMakeRepository.findOne({
                where: { Player_Id: user_id },
            });
            if (user != null) {
                return true;
            }
        }
        return false;
    }
    async AddPlayerToMatchmaking(user_id, type) {
        if (await this.CheckIfPlayerIsInMatchmaking(user_id)) {
            return false;
        }
        if (user_id != null) {
            const user = new Matchmaking_dto_1.MatchmakingDTO();
            user.Player_Id = user_id;
            user.CreatedAt = new Date();
            user.Type = type;
            await this.MatchMakeRepository.save(user);
            return true;
        }
        return false;
    }
    async RemovePlayerFromMatchmaking(user_id) {
        if (user_id != null) {
            const user = await this.MatchMakeRepository.findOne({
                where: { Player_Id: user_id },
            });
            if (user != null) {
                await this.MatchMakeRepository.remove(user);
                return true;
            }
        }
        return false;
    }
    async GetPlayerName(player_id) {
        if (player_id != null) {
            const player = await this.UserRepository.findOne({
                where: { id: player_id },
            });
            if (player != null) {
                return player.login;
            }
        }
        return 'Player_' + player_id;
    }
    async AddPlayerToGame(game_id, user_id) {
        if (game_id != null) {
            if (game_id.length != 36) {
                return false;
            }
            const game = await this.gameRepository.findOne({
                where: { id: game_id },
            });
            if (game != null) {
                game.opponent = user_id;
                await this.gameRepository.save(game);
                return true;
            }
        }
        return false;
    }
};
exports.MatchmakingService = MatchmakingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Game_entity_1.Game)),
    __param(1, (0, typeorm_1.InjectRepository)(Matchmaking_entity_1.Matchmaking)),
    __param(2, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        game_service_1.GameService])
], MatchmakingService);
//# sourceMappingURL=matchmaking.service.js.map