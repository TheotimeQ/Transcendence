import { Repository } from 'typeorm';
import { Game } from 'src/utils/typeorm/Game.entity';
import { CreateGameDTO } from '@/game/dto/CreateGame.dto';
import { GameService } from '@/game/service/game.service';
import { UsersService } from '@/users/users.service';
import { MatchmakingService } from '@/matchmaking/service/matchmaking.service';
import { ScoreService } from '@/score/service/score.service';
import { StatsService } from '@/stats/service/stats.service';
import { AvatarService } from '@/avatar/avatar.service';
export declare class LobbyService {
    readonly gameRepository: Repository<Game>;
    readonly gameService: GameService;
    readonly userService: UsersService;
    readonly matchmakingService: MatchmakingService;
    readonly scoreService: ScoreService;
    readonly statsService: StatsService;
    readonly avatarService: AvatarService;
    constructor(gameRepository: Repository<Game>, gameService: GameService, userService: UsersService, matchmakingService: MatchmakingService, scoreService: ScoreService, statsService: StatsService, avatarService: AvatarService);
    CreateGame(userId: number, newGame: CreateGameDTO): Promise<ReturnData>;
    JoinGame(userId: number, gameId: string): Promise<ReturnData>;
    GetAll(mode?: 'League' | 'Party'): Promise<ReturnData>;
    Quit(userId: number): Promise<ReturnData>;
    IsInGame(userId: number): Promise<ReturnData>;
    private calculateScore;
    private getPlayerLeaderBoard;
    GetAllRanked(): Promise<any>;
    GetLeague(): Promise<any>;
    Populate(): Promise<any>;
}
