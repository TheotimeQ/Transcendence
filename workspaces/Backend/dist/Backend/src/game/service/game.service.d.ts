import { Repository } from 'typeorm';
import { Game } from 'src/utils/typeorm/Game.entity';
import { UsersService } from '@/users/users.service';
import { AvatarService } from '@/avatar/avatar.service';
import { Player } from '@transcendence/shared/types/Game.types';
import { CreateGameDTO } from '../dto/CreateGame.dto';
import { ScoreService } from '@/score/service/score.service';
import { CryptoService } from 'src/utils/crypto/crypto';
export declare class GameService {
    private readonly gameRepository;
    private readonly scoreService;
    private readonly usersService;
    private readonly avatarService;
    private readonly cryptoService;
    constructor(gameRepository: Repository<Game>, scoreService: ScoreService, usersService: UsersService, avatarService: AvatarService, cryptoService: CryptoService);
    getGameById(gameId: string): Promise<any>;
    getAllRankedGames(): Promise<Game[]>;
    getGameByUserId(userId: number): Promise<any>;
    getCurrentGames(): Promise<Game[]>;
    definePlayer(userId: number, side: 'Left' | 'Right', host: boolean): Promise<Player>;
    checkOpponent(gameId: string): Promise<number>;
    createGame(game: CreateGameDTO): Promise<any>;
    addOpponent(gameId: string, opponentId: number): Promise<any>;
    updateStatus(gameId: string, status: 'Not Started' | 'Stopped' | 'Playing' | 'Finished' | 'Deleted', result: 'Not Finished' | 'Host' | 'Opponent' | 'Deleted', actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): Promise<any>;
    quitGame(gameId: string, userId: any): Promise<any>;
    private updateGameScore;
}
