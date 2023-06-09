import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ValidationSchema } from './validation.schema';
import { MailModule } from './mail/mail.module';

import { LobbyModule } from './lobby/lobby.module';
import { Game } from './utils/typeorm/Game.entity';

import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { Matchmaking } from './utils/typeorm/Matchmaking.entity';

import { UsersModule } from './users/users.module';
import { User } from './utils/typeorm/User.entity';
import { Avatar } from './utils/typeorm/Avatar.entity';
import { AvatarModule } from './avatar/avatar.module';
import { ChatModule } from './chat/chat.module';
import { Channel } from './utils/typeorm/Channel.entity';
import { ChannelModule } from './channels/channel.module';
import { HistoryModule } from './history/history.module';
import { History } from './utils/typeorm/History.entity';
import { UserChannelRelation } from './utils/typeorm/UserChannelRelation';
import { UserPongieRelation } from './utils/typeorm/UserPongieRelation';

import { Message } from './utils/typeorm/Message.entity';
import { MessageModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATA_BASE_HOST,
      port: parseInt(process.env.DATA_BASE_PORT),
      username: process.env.DATA_BASE_USER,
      password: process.env.DATA_BASE_PASSWORD,
      database: process.env.DATA_BASE_NAME,
      entities: [
        User,
        Game,
        Matchmaking,
        Avatar,
        Channel,
        Message,
        History,
        UserChannelRelation,
        UserPongieRelation,
      ],
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    LobbyModule,
    MatchmakingModule,
    AvatarModule,
    ChatModule,
    ChannelModule,
    HistoryModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
