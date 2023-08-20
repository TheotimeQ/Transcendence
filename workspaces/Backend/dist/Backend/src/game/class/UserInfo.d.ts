import { Socket } from 'socket.io';
export declare class UserInfo {
    id: number;
    socket: Socket;
    gameId: string;
    isPlayer: boolean;
    pingSend: number;
    private readonly logger;
    constructor(id: number, socket: Socket, gameId: string, isPlayer: boolean);
    sendPing(): void;
}
