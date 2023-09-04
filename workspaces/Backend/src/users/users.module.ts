/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
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
import { AvatarService } from '@/avatar/service/avatar.service';
import { Avatar } from '@/utils/typeorm/Avatar.entity';
import { ChannelService } from '@/channels/service/channel.service';
import { UserChannelRelation } from '@/utils/typeorm/UserChannelRelation';
import { Image } from '@/utils/typeorm/Image.entity';
import { StoryService } from '@/story/service/story.service';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { Matchmaking } from '@/utils/typeorm/Matchmaking.entity';
import { MatchmakingService } from '@/matchmaking/service/matchmaking.service';
import { GameService } from '@/game/service/game.service';
import { Game } from '@/utils/typeorm/Game.entity';
import { Score } from '@/utils/typeorm/Score.entity';
import { ScoreService } from '@/score/service/score.service';
import { StatusService } from '@/statusService/status.service';
import { AchievementService } from '@/achievement/service/achievement.service';
import { Achievement } from '@/utils/typeorm/Achievement.entity';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';
import { ExperienceService } from '@/experience/service/experience.service';
import { ExperienceData } from '@/utils/typeorm/ExperienceData.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      AchievementData,
      Avatar,
      BackupCode,
      Channel,
      ExperienceData,
      Image,
      Matchmaking,
      Notif,
      Score,
      SocketToken,
      Stats,
      Story,
      StoryData,
      Token,
      Game,
      User,
      UserChannelRelation,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    AchievementService,
    AvatarService,
    ChannelService,
    CryptoService,
    ExperienceService,
    GameService,
    MatchmakingService,
    ScoreService,
    StatsService,
    StatusService,
    StoryService,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
