export declare class CreateTrainingDTO {
    name: string;
    type: 'Classic' | 'Best3' | 'Best5' | 'Custom';
    player: number;
    side: 'Left' | 'Right';
    maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxRound: 1 | 3 | 5 | 7 | 9;
    difficulty: -2 | -1 | 0 | 1 | 2;
    push: boolean;
    pause: boolean;
    background: string;
    ball: string;
}
