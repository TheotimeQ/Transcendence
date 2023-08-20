import { Score } from './Score.entity';
export declare class Game {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    type: 'Classic' | 'Best3' | 'Best5' | 'Custom';
    mode: 'League' | 'Party';
    host: number;
    opponent: number;
    hostSide: 'Left' | 'Right';
    score: Score;
    status: 'Not Started' | 'Stopped' | 'Playing' | 'Finished' | 'Deleted';
    result: 'Not Finished' | 'Draw' | 'Draw' | 'Host' | 'Opponent' | 'Deleted';
    actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxRound: 1 | 3 | 5 | 7 | 9;
    difficulty: -2 | -1 | 0 | 1 | 2;
    push: boolean;
    pause: boolean;
    background: string;
    ball: string;
}
