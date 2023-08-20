import { TrainingService } from 'src/training/service/training.service';
import { CreateTrainingDTO } from '@/training/dto/CreateTraining.dto';
import { UpdateTrainingDTO } from '../dto/UpdateTraining.dto';
export declare class TrainingController {
    private readonly trainingService;
    constructor(trainingService: TrainingService);
    Status(): string;
    CreateTraining(training: CreateTrainingDTO): Promise<ReturnData>;
    GetTrainingData(id: string, req: any): Promise<ReturnData>;
    IsInTraining(req: any): Promise<ReturnData>;
    UpdateGame(id: string, req: any, training: UpdateTrainingDTO): Promise<ReturnData>;
    QuitTraining(id: string, req: any): Promise<ReturnData>;
}
