//standard imports
import { OnModuleInit, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';

// websockets imports
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// jwt imports
import { WsJwtGuard } from '../guard/wsJwt.guard';
import { verify } from 'jsonwebtoken';

import { GameService } from '../service/game.service';
import { GameManager } from '../manager/GameManager';

@WebSocketGateway({
  cors: {
    origin: [`http://${process.env.HOST_IP}:3000`, 'http://localhost:3000'],
  },
  namespace: '/game',
  path: '/game/socket.io',
})
@UseGuards(WsJwtGuard)
export class GameGateway implements OnModuleInit {
  // Container of connected users
  private readonly connectedUsers: Map<string, string> = new Map<
    string,
    string
  >();
  private gameManager: GameManager;

  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.gameManager = new GameManager(this.server);
    this.server.on('connection', (socket: Socket) => {
      const token = socket.handshake.headers.authorization?.split(' ')[1];

      try {
        //check if token is valid and get user id(payload.sub)
        const payload = verify(token, process.env.JWT_SECRET) as any;
        if (!payload.sub) {
          socket.disconnect();
          return;
        }
        this.connectedUsers.set(payload.sub, socket.id);

        socket.on('disconnect', () => {
          this.connectedUsers.delete(payload.sub);
          console.log(`User with ID ${payload.sub} disconnected`);
          console.log(this.connectedUsers);
        });

        // [+] ici gestion des room a join en fonction des channels de l'user ?
        socket.join('1 2'); // [!] en vrac&brut pour test

        console.log('connected users = ', this.connectedUsers);
      } catch (error) {
        console.log(error);
        socket.disconnect();
      }
    });
  }

  @SubscribeMessage('play')
  handleMessage(@Req() req: Request): string {
    return 'Hello world!';
  }
}
