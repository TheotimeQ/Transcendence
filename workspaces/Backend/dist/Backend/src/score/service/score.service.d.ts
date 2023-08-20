import { Repository } from 'typeorm';
import { Score } from '@/utils/typeorm/Score.entity';
import { ScoreInfo } from '@transcendence/shared/types/Score.types';
import { CreateScoreDTO } from '@/score/dto/CreateScore.dto';
export declare class ScoreService {
    private readonly scoreRepository;
    constructor(scoreRepository: Repository<Score>);
    createScore(newScore: CreateScoreDTO): Promise<Score>;
    addOpponent(gameId: string, opponentId: number): Promise<void>;
    getScoreByGameId(gameId: string): Promise<ScoreInfo>;
    updateScore(gameId: string, scoreInfo: ScoreInfo, actualRound: number, changeRound: boolean): Promise<void>;
    updateRageQuit(gameId: string, rageQuit: 'Left' | 'Right'): Promise<void>;
}
