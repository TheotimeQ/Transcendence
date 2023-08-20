import { Repository } from 'typeorm';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { CreateStatsDTO } from '../dto/CreateStats.dto';
import { ScoreInfo } from '@transcendence/shared/types/Score.types';
export declare class StatsService {
    private readonly statsRepository;
    constructor(statsRepository: Repository<Stats>);
    createStats(newStats: CreateStatsDTO): Promise<Stats>;
    updateStats(userId: number, type: 'Classic' | 'Best3' | 'Best5' | 'Custom', mode: 'League' | 'Party' | 'Training', side: 'Left' | 'Right', score: ScoreInfo, nbRound: number): Promise<Stats>;
    getStatsByUserId(userId: number): Promise<ReturnData>;
    private defineLeagueStats;
    private definePartyStats;
    private defineTrainingStats;
    getStats(): Promise<Stats[]>;
}
