export declare class UpdateStatsDTO {
    name: string;
    type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Training';
    mode: 'League' | 'Party' | 'Training';
    host: number;
    opponent: number;
    hostSide: 'Left' | 'Right';
    maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
    maxRound: 1 | 3 | 5 | 7 | 9;
    difficulty: 1 | 2 | 3 | 4 | 5;
    push: boolean;
    background: string;
    ball: string;
}
