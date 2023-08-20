import { Server, Socket } from 'socket.io';
import { ActionDTO } from '../dto/Action.dto';
import { GameService } from '../service/game.service';
import { ColoredLogger } from '../colored-logger';
import { ScoreService } from '@/score/service/score.service';
import { StatsService } from '@/stats/service/stats.service';
export declare class GameManager {
    private readonly gameService;
    private readonly scoreService;
    private readonly statsService;
    private readonly logger;
    private readonly pongOnGoing;
    private usersConnected;
    private server;
    constructor(gameService: GameService, scoreService: ScoreService, statsService: StatsService, logger: ColoredLogger);
    setServer(server: Server): void;
    joinGame(gameId: string, userId: number, socket: Socket): Promise<any>;
    playerAction(action: ActionDTO, socket: Socket): Promise<any>;
    updatePong(userId: number, socket: Socket): void;
    disconnect(userId: number, socket: Socket, manual: boolean): Promise<any>;
    private createPong;
    private checkConnexion;
}
