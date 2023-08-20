import { Repository } from 'typeorm';
import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { GameService } from '@/game/service/game.service';
export declare class MatchmakingService {
    private readonly gameRepository;
    private readonly MatchMakeRepository;
    private readonly UserRepository;
    private readonly gameService;
    constructor(gameRepository: Repository<Game>, MatchMakeRepository: Repository<Matchmaking>, UserRepository: Repository<User>, gameService: GameService);
    MatchmakeStart(req: any): Promise<any>;
    MatchmakeStop(req: any): Promise<any>;
    MatchmakeUpdate(req: any): Promise<any>;
    CheckIfTwoPlayerAreInMatchmaking(): Promise<any>;
    CheckIfAlreadyInMatchmaking(user_id: number): Promise<any>;
    GetGameId(user_id: number): Promise<any>;
    CheckIfAlreadyInGame(user_id: number): Promise<any>;
    CheckIfPlayerIsInMatchmaking(user_id: number): Promise<any>;
    AddPlayerToMatchmaking(user_id: number, type: string): Promise<any>;
    RemovePlayerFromMatchmaking(user_id: number): Promise<any>;
    GetPlayerName(player_id: number): Promise<string>;
    AddPlayerToGame(game_id: string, user_id: number): Promise<any>;
}
