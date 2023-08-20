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
exports.LobbyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Game_entity_1 = require("../../utils/typeorm/Game.entity");
const game_service_1 = require("../../game/service/game.service");
const users_service_1 = require("../../users/users.service");
const matchmaking_service_1 = require("../../matchmaking/service/matchmaking.service");
const score_service_1 = require("../../score/service/score.service");
const stats_service_1 = require("../../stats/service/stats.service");
const avatar_service_1 = require("../../avatar/avatar.service");
let LobbyService = exports.LobbyService = class LobbyService {
    constructor(gameRepository, gameService, userService, matchmakingService, scoreService, statsService, avatarService) {
        this.gameRepository = gameRepository;
        this.gameService = gameService;
        this.userService = userService;
        this.matchmakingService = matchmakingService;
        this.scoreService = scoreService;
        this.statsService = statsService;
        this.avatarService = avatarService;
    }
    async CreateGame(userId, newGame) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const gameId = await this.gameService.getGameByUserId(userId);
            if (gameId) {
                ret.message = 'You are already in a game';
                ret.data = gameId;
                return ret;
            }
            else if (await this.matchmakingService.CheckIfAlreadyInMatchmaking(userId)) {
                ret.message = 'You are already in matchmaking';
                return ret;
            }
            const newGameId = await this.gameService.createGame(newGame);
            ret.success = true;
            ret.message = 'Game created';
            ret.data = newGameId;
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    async JoinGame(userId, gameId) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                ret.message = 'User not found';
                return ret;
            }
            const game = await this.gameService.getGameById(gameId);
            if (!game) {
                ret.message = 'Game not found';
                return ret;
            }
            if (game.host === userId || game.opponent === userId) {
                ret.success = true;
                ret.message = 'You are already in this game';
                return ret;
            }
            if (game.opponent !== -1) {
                ret.message = 'Game is full';
                return ret;
            }
            await this.gameService.addOpponent(gameId, userId);
            ret.success = true;
            ret.message = 'You joined the game as an opponent';
            ret.data = gameId;
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    async GetAll(mode) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const games = await this.gameService.getCurrentGames();
            if (!games) {
                ret.message = 'No games found';
                return ret;
            }
            const gamesInfos = [];
            for (const game of games) {
                if (mode && game.mode !== mode)
                    continue;
                const leftPlayer = await this.gameService.definePlayer(game.hostSide === 'Left' ? game.host : game.opponent, 'Left', game.hostSide === 'Left');
                const rightPlayer = await this.gameService.definePlayer(game.hostSide === 'Right' ? game.host : game.opponent, 'Right', game.hostSide === 'Right');
                const gameInfo = {
                    id: game.id,
                    name: game.name,
                    type: game.type,
                    mode: game.mode,
                    leftPlayer: leftPlayer,
                    rightPlayer: rightPlayer,
                    actualRound: game.actualRound,
                    maxRound: game.maxRound,
                    status: game.status,
                };
                gamesInfos.push(gameInfo);
            }
            ret.success = true;
            ret.message = 'Games found';
            ret.data = gamesInfos;
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    async Quit(userId) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const gameId = await this.gameService.getGameByUserId(userId);
            if (!gameId) {
                ret.message = 'You are already not in a game';
                return ret;
            }
            await this.gameService.quitGame(gameId, userId);
            ret.success = true;
            ret.message = 'You quit the game';
            return ret;
        }
        catch (error) {
            return ret;
        }
    }
    async IsInGame(userId) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            if (await this.matchmakingService.CheckIfAlreadyInMatchmaking(userId)) {
                await this.matchmakingService.RemovePlayerFromMatchmaking(userId);
            }
            const gameId = await this.gameService.getGameByUserId(userId);
            if (!gameId) {
                ret.message = 'You are not in a game';
                return ret;
            }
            ret.success = true;
            ret.message = 'You are in a game';
            ret.data = gameId;
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    calculateScore(stat) {
        let score = 0;
        score += stat.leagueClassicWon * 10;
        score += stat.leagueClassicLost * -10;
        score += stat.leagueBest3Won * 10;
        score += stat.leagueBest3Lost * -10;
        score += stat.leagueBest5Won * 10;
        score += stat.leagueBest5Lost * -10;
        score += stat.leagueRageQuitWin * 10;
        score += stat.leagueRageQuitLost * -10;
        score += stat.leagueDisconnectWin * 10;
        score += stat.leagueDisconnectLost * -10;
        score += stat.leagueRoundWon * 10;
        score += stat.leagueRoundLost * -10;
        score += stat.leaguePointWon * 10;
        score += stat.leaguePointLost * -10;
        return score;
    }
    async getPlayerLeaderBoard() {
        try {
            const stats = await this.statsService.getStats();
            const playerLeaderBoard = await Promise.all(stats.map(async (stat) => {
                let userLogin = "Noone";
                let avatar = "/images/avatars/avatar1.png";
                let back = "#000000";
                let border = "#000000";
                if (stat.userId != -1) {
                    const user = await this.userService.getUserById(stat.userId);
                    const userAvatar = await this.avatarService.getAvatarById(stat.userId, false);
                    if (user != null && userAvatar != null) {
                        userLogin = user.login;
                        back = userAvatar.backgroundColor;
                        border = userAvatar.borderColor;
                    }
                }
                const score = this.calculateScore(stat);
                return {
                    login: userLogin,
                    score: score,
                    rank: 0,
                    avatar: avatar,
                    back: back,
                    border: border,
                };
            }));
            playerLeaderBoard.sort((a, b) => b.score - a.score);
            playerLeaderBoard.forEach((player, index) => {
                if (player)
                    player.rank = index + 1;
            });
            return playerLeaderBoard;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async GetAllRanked() {
        const games = await this.gameService.getAllRankedGames();
        const gamesInfos = await Promise.all(games.map(async (game) => {
            let hostLogin = "Noone";
            let hostAvatarImage = "/images/avatars/avatar1.png";
            let hostAvatarBack = "#000000";
            let hostAvatarBorder = "#000000";
            if (game.host != -1) {
                const host = await this.userService.getUserById(game.host);
                const hostAvatar = await this.avatarService.getAvatarById(game.host, false);
                if (host != null && hostAvatar != null) {
                    hostLogin = host.login;
                    hostAvatarBack = hostAvatar.backgroundColor;
                    hostAvatarBorder = hostAvatar.borderColor;
                }
            }
            let opponentLogin = "Noone";
            let opponentAvatarImage = "/images/avatars/avatar1.png";
            let opponentAvatarBack = "#000000";
            let opponentAvatarBorder = "#000000";
            if (game.opponent != -1) {
                const opponent = await this.userService.getUserById(game.opponent);
                const opponentAvatar = await this.avatarService.getAvatarById(game.opponent, false);
                if (opponent != null && opponentAvatar != null) {
                    opponentLogin = opponent.login;
                    opponentAvatarBack = opponentAvatar.backgroundColor;
                    opponentAvatarBorder = opponentAvatar.borderColor;
                }
            }
            const gameInfo = {
                name: game.name,
                hostLogin: hostLogin,
                hostAvatarImage: hostAvatarImage,
                hostAvatarBack: hostAvatarBack,
                hostAvatarBorder: hostAvatarBorder,
                opponentLogin: opponentLogin,
                opponentAvatarImage: opponentAvatarImage,
                opponentAvatarBack: opponentAvatarBack,
                opponentAvatarBorder: opponentAvatarBorder,
                Type: game.type,
            };
            return gameInfo;
        }));
        return gamesInfos;
    }
    async GetLeague() {
        try {
            const Data = {
                success: true,
                message: 'Request successfulld',
                data: {
                    Top10: await this.getPlayerLeaderBoard(),
                    AllRanked: await this.GetAllRanked(),
                },
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
    async Populate() {
        const game_1 = {
            name: "Test1" + ' vs ' + "Test2",
            type: 'Classic',
            mode: 'League',
            host: 1,
            opponent: -1,
            hostSide: 'Left',
            maxPoint: 9,
            maxRound: 1,
            difficulty: 2,
            push: false,
            pause: false,
            background: 'classic',
            ball: 'classic',
        };
        const game_2 = {
            name: "Test3" + ' vs ' + "Test4",
            type: 'Classic',
            mode: 'League',
            host: 1,
            opponent: -1,
            hostSide: 'Left',
            maxPoint: 9,
            maxRound: 1,
            difficulty: 2,
            push: false,
            pause: false,
            background: 'classic',
            ball: 'classic',
        };
        const game1 = await this.gameService.createGame(game_1);
        const game2 = await this.gameService.createGame(game_2);
        const stat_1 = {
            userId: 1,
            leagueClassicWon: 1,
            leagueClassicLost: 0,
            leagueBest3Won: 0,
            leagueBest3Lost: 0,
            leagueBest5Won: 0,
            leagueBest5Lost: 0,
            leagueRageQuitWin: 0,
            leagueRageQuitLost: 0,
            leagueDisconnectWin: 0,
            leagueDisconnectLost: 0,
            leagueRoundWon: 1,
            leagueRoundLost: 0,
            leaguePointWon: 9,
            leaguePointLost: 0,
        };
        const stat1 = await this.statsService.createStats(stat_1);
    }
};
exports.LobbyService = LobbyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Game_entity_1.Game)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        game_service_1.GameService,
        users_service_1.UsersService,
        matchmaking_service_1.MatchmakingService,
        score_service_1.ScoreService,
        stats_service_1.StatsService,
        avatar_service_1.AvatarService])
], LobbyService);
//# sourceMappingURL=lobby.service.js.map