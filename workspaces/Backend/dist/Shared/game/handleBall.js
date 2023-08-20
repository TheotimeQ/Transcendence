"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServe = exports.updateBall = exports.handlePlayerCollision = exports.calculateBallAngle = exports.handlePush = exports.resetBall = void 0;
const Game_types_1 = require("../types/Game.types");
const Game_constants_1 = require("../constants/Game.constants");
function resetBall(ball, game) {
    ball.posX = Game_constants_1.GAME_WIDTH / 2;
    ball.posY = Game_constants_1.GAME_HEIGHT / 2;
    ball.moveX = Game_types_1.DirXValues.Idle;
    ball.moveY = Game_types_1.DirYValues.Idle;
    while (ball.push > 0) {
        ball.push--;
        ball.speed -= 1;
    }
}
exports.resetBall = resetBall;
function handlePush(ball, player) {
    if (player.push > 0 && player.push <= 5) {
        ball.push++;
        ball.speed += 1;
    }
    else if (ball.push > 0) {
        ball.push--;
        ball.speed -= 1;
    }
}
exports.handlePush = handlePush;
function calculateBallAngle(ball, posY, height) {
    const relativeIntersectY = posY + height / 2 - (ball.posY + Game_constants_1.BALL_SIZE / 2);
    const normalIntersectY = relativeIntersectY / (height / 2);
    const bounceAngle = normalIntersectY * 45;
    return bounceAngle * (Math.PI / 180);
}
exports.calculateBallAngle = calculateBallAngle;
function handlePlayerCollision(ball, player, playerSide) {
    const margin = ball.speed * 1.5;
    if ((playerSide === "Left" &&
        ball.posX >= player.posX + Game_constants_1.PLAYER_WIDTH - margin / 2 &&
        ball.posX <= player.posX + Game_constants_1.PLAYER_WIDTH + margin / 2) ||
        (playerSide === "Right" &&
            ball.posX + Game_constants_1.BALL_SIZE >= player.posX - margin / 2 &&
            ball.posX + Game_constants_1.BALL_SIZE <= player.posX + margin / 2)) {
        if (ball.posY + Game_constants_1.BALL_SIZE >= player.posY &&
            ball.posY <= player.posY + Game_constants_1.PLAYER_HEIGHT) {
            const newAngle = calculateBallAngle(ball, player.posY, Game_constants_1.PLAYER_HEIGHT);
            const newMoveX = Math.cos(newAngle);
            if (Math.sign(ball.moveX) === Math.sign(newMoveX)) {
                ball.moveX = -1 * newMoveX;
            }
            else {
                ball.moveX = newMoveX;
            }
            ball.moveY = -Math.sin(newAngle);
            handlePush(ball, player);
        }
        else if (ball.posY + Game_constants_1.BALL_SIZE >= player.posY - margin &&
            ball.posY + Game_constants_1.BALL_SIZE < player.posY &&
            ball.moveY < Game_types_1.DirYValues.Idle) {
            ball.moveY *= -1;
        }
        else if (ball.posY > player.posY + Game_constants_1.PLAYER_WIDTH &&
            ball.posY < player.posY + Game_constants_1.PLAYER_WIDTH + margin &&
            ball.moveY > Game_types_1.DirYValues.Idle) {
            ball.moveY *= -1;
        }
    }
}
exports.handlePlayerCollision = handlePlayerCollision;
function updateBall(ball, game) {
    if (ball.moveX < Game_types_1.DirXValues.Idle) {
        handlePlayerCollision(ball, game.playerLeftDynamic, "Left");
    }
    else if (ball.moveX > Game_types_1.DirXValues.Idle) {
        handlePlayerCollision(ball, game.playerRightDynamic, "Right");
    }
    ball.posY += ball.moveY * ball.speed;
    ball.posX += ball.moveX * ball.speed;
    if (ball.posX <= 0) {
        return "reset Left";
    }
    else if (ball.posX >= Game_constants_1.GAME_WIDTH - Game_constants_1.BALL_SIZE) {
        return "reset Right";
    }
    if (ball.posY <= 0) {
        ball.moveY *= -1;
        ball.posY = 1;
    }
    else if (ball.posY >= Game_constants_1.GAME_HEIGHT - Game_constants_1.BALL_SIZE) {
        ball.moveY *= -1;
        ball.posY = Game_constants_1.GAME_HEIGHT - Game_constants_1.BALL_SIZE - 1;
    }
    return "Ball updated";
}
exports.updateBall = updateBall;
function handleServe(ball, game) {
    ball.moveX = game.playerServe === "Left" ? Game_types_1.DirXValues.Right : Game_types_1.DirXValues.Left;
    if (Math.random() < 0.5) {
        ball.moveY = Game_types_1.DirYValues.Up;
    }
    else {
        ball.moveY = Game_types_1.DirYValues.Down;
    }
    var pos = Math.random() * (Game_constants_1.GAME_HEIGHT / 2 - Game_constants_1.BALL_SIZE);
    if (Math.random() < 0.5)
        pos *= -1;
    const newAngle = calculateBallAngle(ball, pos, Game_constants_1.GAME_HEIGHT);
    const newMoveX = Math.cos(newAngle);
    if (Math.sign(ball.moveX) === Math.sign(newMoveX)) {
        ball.moveX = -1 * newMoveX;
    }
    else {
        ball.moveX = newMoveX;
    }
    ball.moveY = -Math.sin(newAngle);
    game.playerServe = null;
}
exports.handleServe = handleServe;
//# sourceMappingURL=handleBall.js.map