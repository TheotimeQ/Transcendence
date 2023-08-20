import { Score } from './Score.entity';
export declare class Training {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    type: 'Classic' | 'Best3' | 'Best5' | 'Custom';
    player: number;
    side: 'Left' | 'Right';
    score: Score;
    status: 'Not Started' | 'Stopped' | 'Playing' | 'Finished' | 'Deleted';
    result: 'Not Finished' | 'Win' | 'Lose' | 'Deleted';
    actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxRound: 1 | 3 | 5 | 7 | 9;
    difficulty: -2 | -1 | 0 | 1 | 2;
    push: boolean;
    pause: boolean;
    background: string;
    ball: string;
}
