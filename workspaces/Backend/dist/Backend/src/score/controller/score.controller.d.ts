import { ScoreService } from '../service/score.service';
import { UpdateScoreDTO } from '../dto/UpdateScore.dto';
export declare class ScoreController {
    private readonly scoreService;
    constructor(scoreService: ScoreService);
    getScoreByGameId(gameId: string): Promise<import("@transcendence/shared/types/Score.types").ScoreInfo>;
    updateScore(req: any, updateScore: UpdateScoreDTO): Promise<void>;
}
