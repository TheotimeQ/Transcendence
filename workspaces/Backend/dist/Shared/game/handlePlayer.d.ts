import { GameData, Ball, Player, PlayerDynamic } from "@transcendence/shared/types/Game.types";
export declare function handlePush(player: Player, playerDynamic: PlayerDynamic): void;
export declare function updatePlayer(player: Player, playerDynamic: PlayerDynamic): void;
export declare function moveAI(game: GameData, player: Player, playerDynamic: PlayerDynamic, Ball: Ball): void;
