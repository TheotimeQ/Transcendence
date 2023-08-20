import { MatchmakingService } from '../service/matchmaking.service';
export declare class MatchmakingController {
    private readonly matchmakingService;
    constructor(matchmakingService: MatchmakingService);
    MatchmakeStart(req: any): Promise<any>;
    MatchmakeStop(req: any): Promise<any>;
    MatchmakeUpdate(req: any): Promise<any>;
}
