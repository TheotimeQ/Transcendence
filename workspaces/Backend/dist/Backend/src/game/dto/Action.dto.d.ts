import { Action } from '@transcendence/shared/types/Game.types';
export declare class ActionDTO {
    userId: number;
    gameId: string;
    move: Action;
    playerSide: 'Left' | 'Right';
}
