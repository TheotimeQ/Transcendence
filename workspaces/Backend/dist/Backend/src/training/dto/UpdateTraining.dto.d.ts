export declare class UpdateTrainingDTO {
    status: 'Not Started' | 'Stopped' | 'Playing' | 'Finished' | 'Deleted';
    result: 'Not Finished' | 'Host' | 'Opponent' | 'Deleted';
    actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}
