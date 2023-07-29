import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchmakingService } from './service/matchmaking.service';
import { MatchmakingController } from './controller/matchmaking.controller';

import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { LobbyUtils } from '@/lobby/service/lobbyUtils';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Matchmaking, User])],
  controllers: [MatchmakingController],
  providers: [MatchmakingService, LobbyUtils],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
