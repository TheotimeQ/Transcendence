"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveAI = exports.updatePlayer = exports.handlePush = void 0;
const Game_types_1 = require("../types/Game.types");
const Game_constants_1 = require("../constants/Game.constants");
function handlePush(player, playerDynamic) {
    if (playerDynamic.push > 0 && playerDynamic.push <= Game_constants_1.PUSH_SIZE / 2) {
        playerDynamic.push++;
        playerDynamic.posX += player.side === "Left" ? 5 : -5;
    }
    else if (playerDynamic.push > Game_constants_1.PUSH_SIZE / 2 &&
        playerDynamic.push <= Game_constants_1.PUSH_SIZE) {
        playerDynamic.push++;
        playerDynamic.posX += player.side === "Left" ? -5 : 5;
        if (playerDynamic.push === Game_constants_1.PUSH_SIZE + 1) {
            playerDynamic.push = 0;
        }
    }
}
exports.handlePush = handlePush;
function updatePlayer(player, playerDynamic) {
    if (playerDynamic.move === "Up") {
        playerDynamic.posY -= playerDynamic.speed;
    }
    else if (playerDynamic.move === "Down") {
        playerDynamic.posY += playerDynamic.speed;
    }
    playerDynamic.posY = Math.max(0, Math.min(Game_constants_1.GAME_HEIGHT - Game_constants_1.PLAYER_HEIGHT, playerDynamic.posY));
    handlePush(player, playerDynamic);
}
exports.updatePlayer = updatePlayer;
function moveAI(game, player, playerDynamic, Ball) {
    const targetY = Ball.posY - Game_constants_1.PLAYER_HEIGHT / 2;
    const moveSlow = playerDynamic.speed / 1.5;
    const moveFast = playerDynamic.speed;
    let movementSpeed = moveSlow;
    if ((player.side === "Left" && Ball.moveX < Game_types_1.DirXValues.Idle) ||
        (player.side === "Right" && Ball.moveX > Game_types_1.DirXValues.Idle)) {
        movementSpeed = moveFast;
    }
    if (playerDynamic.posY > targetY) {
        playerDynamic.posY -= Math.min(movementSpeed, playerDynamic.posY - targetY);
    }
    else if (playerDynamic.posY < targetY) {
        playerDynamic.posY += Math.min(movementSpeed, targetY - playerDynamic.posY);
    }
    if (game.push) {
        const ballNearPlayerPaddle = Ball.posX - Game_constants_1.BALL_SIZE <= playerDynamic.posX + Game_constants_1.PLAYER_WIDTH &&
            Ball.posX + Game_constants_1.BALL_SIZE * 2 >= playerDynamic.posX &&
            Ball.posY + Game_constants_1.BALL_SIZE >= playerDynamic.posY &&
            Ball.posY <= playerDynamic.posY + Game_constants_1.PLAYER_HEIGHT;
        if (ballNearPlayerPaddle &&
            playerDynamic.push === 0 &&
            Math.random() > 0.33) {
            playerDynamic.push = 1;
        }
        handlePush(player, playerDynamic);
    }
    playerDynamic.posY = Math.max(0, Math.min(Game_constants_1.GAME_HEIGHT - Game_constants_1.PLAYER_HEIGHT, playerDynamic.posY));
}
exports.moveAI = moveAI;
//# sourceMappingURL=handlePlayer.js.map