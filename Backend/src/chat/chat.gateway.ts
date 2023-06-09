/* eslint-disable prettier/prettier */
import { OnModuleInit, Request, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './guard/wsJwt.guard';
import { verify } from 'jsonwebtoken';
import { ChatService } from './chat.service';
import { newMsgDto } from './dto/newMsg.dto';
import { sendMsgDto } from './dto/sendMsg.dto';
import { MessagesService } from 'src/messages/messages.service';
import { userLightDto } from './dto/userLight.dto';
import { Message } from 'src/utils/typeorm/Message.entity';
import { ChannelService } from 'src/channels/channel.service';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: [
      `http://${process.env.HOST_IP}:3000`,
      "http://localhost:3000",
    ],
  },
  namespace: '/chat',
  path: '/chat/socket.io',
})
export class ChatGateway implements OnModuleInit {
  constructor(
	private readonly chatService: ChatService,
	private readonly messageService: MessagesService,
	private readonly channelService: ChannelService,
	) {}

  // Container of connected users : Map<userId, socket.id>
  private connectedUsers: Map<string, string> = new Map<string, string>();

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const token = socket.handshake.headers.authorization?.split(' ')[1];

      try {
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

        console.log("connected users = ", this.connectedUsers);

      } catch (error) {
        console.log(error);
        socket.disconnect();
      }
    });
  }



  // [!][+] implementer un try catch ?
  // [+] nettoyer ranger en placant un max dans le service ?
  @SubscribeMessage('newMsg')
  async yoping(@MessageBody() message: newMsgDto, @Request() req) {
    if (1/* check si l'user est bien dans la channel */) {
      // [?] Si la room n'existe pas elle est créée -> besoin de vérifier que la room existe ?

      // passer une une date en objet direct pose problème
      // conversion par ISOString
      const now = new Date();
      const nowtoISOString = now.toISOString();
	
	  // [?] passer au dessus du if ?
	  const fetchedChannel = await this.channelService.getChannelById(message.channelId);
      // [+] la secu que req.user.id est bien dans la channel, en guard/ fction ?
	  

      const sendMsg:sendMsgDto = {
        content: message.content,
        date: nowtoISOString,
        senderId: req.user.id,
		channelName: fetchedChannel.name,
		channelId: message.channelId,
      }

      console.log("going to send " + sendMsg.content + " to " + fetchedChannel.name); // checking - garder ce log ?
     
	  // [!][+] ici ajouter le message dans la database via messageService
	  this.messageService.addMessage(sendMsg);
	 
	  this.server.to(sendMsg.channelName).emit('sendMsg', sendMsg);
    } else {
      // [?] Besoin de mieux sécuriser ou gérer ce cas ?
      // [!] Avec une throw WsException ?
      console.log("@SubscribeMessage('newMsg') error detected user :",req.user.id, " is not in channel nammed");
    }
  }

  @SubscribeMessage('getChannels')
  async getChannels(@Request() req) {
    return await this.chatService.getChannels(req.user.id);
  }

  @SubscribeMessage('getAllChannels')
  async getAllChannels(@Request() req) {
    return await this.chatService.getAllChannels(req.user.id);
  }

  @SubscribeMessage('getPongies')
  async getPongies(@Request() req) {
	  return await this.chatService.getPongies(req.user.id);
  }

  @SubscribeMessage('getAllPongies')
  async getAllPongies(@Request() req) {
	  return await this.chatService.getAllPongies(req.user.id);
  }

  // [!][+] add dto pour le data
  @SubscribeMessage('joinPrivateMsgChannel')
  async joinOrCreatePrivateMsgChannel( @MessageBody() data: { pongieId: string },
    @Request() req,
  ) {

    return await this.chatService.joinOrCreatePrivateMsgChannel(
      req.user.id,
      data.pongieId,
    );
  }

  @SubscribeMessage('addPongie')
  async addPongie(
    @MessageBody() pongieId: number,
    @Request() req
  ) {
    return await this.chatService.addPongie(req.user.id, pongieId);
  }

  @SubscribeMessage('deletePongie')
  async deletePongie(
    @MessageBody() pongieId: number,
    @Request() req
  ) {
    return await this.chatService.deletePongie(req.user.id, pongieId);
  }

  @SubscribeMessage('join')
  async join(
    @MessageBody() payload: {
      id: number,
      channelName: string,
      channelType: "public" | "protected" | "private" | "privateMsg",
    },
    @Request() req,
    @ConnectedSocket() socket: Socket,
  ) {
    if (payload.channelType === "privateMsg")
      return await this.chatService.joinPongie(
        req.user.id,
        payload.id,
        socket,
      );
    else
      return await this.chatService.joinChannel(
        req.user.id,
        payload.id,
        payload.channelName,
        payload.channelType,
        socket,
        this.server,
      );
  }

  @SubscribeMessage("leave")
  async leave(
    @MessageBody() channelId: number,
    @Request() req,
    @ConnectedSocket() socket,
  ) {
    return await this.chatService.leave(req.user.id, channelId, socket, this.server);
  }

  // reception des messages contenus dans une channel
  // [+] creer dto pour reception du channelId ?
  @SubscribeMessage("getMessages")
  async getMessages(
	@MessageBody() payload: {channelId:string},
    @Request() req,
  ) {
    const id:number = parseInt(payload.channelId);

	// [+] securiser (aussi besoin pour en dessous "getChannelUsers" en faire un fonction ou un Guard ??)
    // verif avec req.user.id que la channel est bien dans sa channelList
    // this.chatService.isUserIntoChannel()
	
	// const data:Message[] = (await this.chatService.getMessages(id)).messages;
	// data.forEach((msg) => {
	// 	console.log("msg.user = ", msg.user)
	// });

    return (await this.chatService.getMessages(id)).messages;
  }


  // [!] au final pas utilise dans <ChatChannel />
  @SubscribeMessage("getChannelUsers")
  async getChannelUsers(
	@MessageBody() payload: {channelId:string},
    @Request() req,
  ) {
    const id:number = parseInt(payload.channelId);
    console.log("getChannelUsers proc --> ChannelId : ", id);

	// [+] secu du req.user.id (voir dessus)
	// [+][?] virer ce userLight au final ?
	const usersLight:userLightDto[] = await this.chatService.getChannelUsersLight(id);
	console.log(usersLight);
    
    return usersLight;
  }
}
