import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameService } from '../service/game.service';
import { GameManager } from '../class/GameManager';
import { ColoredLogger } from '../colored-logger';
import { ActionDTO } from '../dto/Action.dto';
export declare class GameGateway implements OnModuleInit {
    private readonly gameService;
    private readonly gameManager;
    private readonly logger;
    constructor(gameService: GameService, gameManager: GameManager, logger: ColoredLogger);
    server: Server;
    onModuleInit(): void;
    joinGame(socket: Socket, req: any, gameId: string): Promise<any>;
    handleHeartbeat(userId: number, socket: Socket): void;
    handleAction(action: ActionDTO, socket: Socket): void;
    quitGame(socket: Socket, req: any): void;
}
