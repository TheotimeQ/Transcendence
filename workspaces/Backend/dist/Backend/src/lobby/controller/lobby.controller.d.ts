import { LobbyService } from '../service/lobby.service';
import { CreateGameDTO } from '@/game/dto/CreateGame.dto';
export declare class LobbyController {
    private readonly lobbyService;
    constructor(lobbyService: LobbyService);
    Status(): string;
    CreateGame(req: any, game: CreateGameDTO): Promise<ReturnData>;
    JoinGame(req: any, gameId: string): Promise<ReturnData>;
    GetAllGames(mode?: 'League' | 'Party'): Promise<ReturnData>;
    Quit(req: any): Promise<ReturnData>;
    IsInGame(req: any): Promise<ReturnData>;
    GetLeague(): Promise<any>;
    Populate(): Promise<any>;
}
