import { Module } from '@nestjs/common';
import { StatsController } from './controller/stats.controller';
import { StatsService } from './service/stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from 'src/utils/typeorm/Stats.entity';
import { ExperienceService } from '@/experience/service/experience.service';
import { ExperienceData } from '@/utils/typeorm/ExperienceData.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExperienceData, Stats])],
  controllers: [StatsController],
  providers: [ExperienceService, StatsService],
  exports: [StatsService],
})
export class StatsModule {}
