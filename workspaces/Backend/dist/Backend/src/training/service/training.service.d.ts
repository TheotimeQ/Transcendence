import { Repository } from 'typeorm';
import { Training } from 'src/utils/typeorm/Training.entity';
import { ScoreService } from '@/score/service/score.service';
import { CryptoService } from '@/utils/crypto/crypto';
import { UsersService } from '@/users/users.service';
import { AvatarService } from '@/avatar/avatar.service';
import { CreateTrainingDTO } from '../dto/CreateTraining.dto';
import { UpdateTrainingDTO } from '../dto/UpdateTraining.dto';
export declare class TrainingService {
    private readonly trainingRepository;
    private readonly scoreService;
    private readonly cryptoService;
    private readonly usersService;
    private readonly avatarService;
    constructor(trainingRepository: Repository<Training>, scoreService: ScoreService, cryptoService: CryptoService, usersService: UsersService, avatarService: AvatarService);
    createTraining(training: CreateTrainingDTO): Promise<ReturnData>;
    getTrainingById(trainingId: string, userId: number): Promise<ReturnData>;
    isInTraining(userId: number): Promise<ReturnData>;
    updateTraining(trainingId: string, userId: number, updates: UpdateTrainingDTO): Promise<ReturnData>;
    quitTraining(trainingId: string, userId: number): Promise<ReturnData>;
    private updateTrainingScore;
    private definePlayer;
}
