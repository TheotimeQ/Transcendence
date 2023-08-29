/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { CryptoService } from 'src/utils/crypto/crypto';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Token } from 'src/utils/typeorm/Token.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { StatsService } from '@/stats/service/stats.service';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { AvatarService } from '@/avatar/avatar.service';
import { Avatar } from '@/utils/typeorm/Avatar.entity';
import { ChannelService } from '@/channels/channel.service';
import { UserChannelRelation } from '@/utils/typeorm/UserChannelRelation';
import { Image } from '@/utils/typeorm/Image.entity';
import { StoryService } from '@/story/service/story.service';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Channel,
      Token,
      BackupCode,
      SocketToken,
      Stats,
      Notif,
      Avatar,
      UserChannelRelation,
      Image,
      Story,
      StoryData,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CryptoService,
    StatsService,
    AvatarService,
    ChannelService,
    StoryService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
