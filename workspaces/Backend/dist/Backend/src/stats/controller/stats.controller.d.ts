import { StatsService } from '../service/stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    Status(): string;
    GetStatsByUserId(userId: number): Promise<ReturnData>;
}
