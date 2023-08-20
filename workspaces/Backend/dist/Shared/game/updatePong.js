"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePong = void 0;
const handlePlayer_1 = require("./handlePlayer");
const handleBall_1 = require("./handleBall");
const Game_constants_1 = require("../constants/Game.constants");
const pongUtils_1 = require("./pongUtils");
function resetTurn(winner, gameData) {
    (0, handleBall_1.resetBall)(gameData.ball, gameData);
    gameData.playerServe = winner;
    const actualRound = gameData.actualRound;
    if (winner === "Left") {
        gameData.score.round[actualRound].left++;
    }
    else if (winner === "Right") {
        gameData.score.round[actualRound].right++;
    }
    gameData.updateScore = true;
}
function handleRound(gameData) {
    const actualRound = gameData.actualRound;
    const leftScore = gameData.score.round[actualRound].left;
    const rightScore = gameData.score.round[actualRound].right;
    if (leftScore === gameData.maxPoint || rightScore === gameData.maxPoint) {
        if (leftScore > rightScore) {
            gameData.score.leftRound++;
        }
        else if (leftScore < rightScore) {
            gameData.score.rightRound++;
        }
        if (gameData.score.leftRound > gameData.maxRound / 2 ||
            gameData.score.rightRound > gameData.maxRound / 2) {
            gameData.status = "Finished";
            gameData.actualRound++;
            if (gameData.score.leftRound > gameData.score.rightRound) {
                if (gameData.playerLeft.host)
                    gameData.result = "Host";
                else
                    gameData.result = "Opponent";
            }
            else if (gameData.score.leftRound < gameData.score.rightRound) {
                if (gameData.playerLeft.host)
                    gameData.result = "Opponent";
                else
                    gameData.result = "Host";
            }
        }
        else {
            gameData.actualRound++;
            gameData.playerLeftDynamic.speed++;
            gameData.playerRightDynamic.speed++;
            gameData.ball.speed++;
            gameData.timer = (0, pongUtils_1.defineTimer)(Game_constants_1.TIMER_ROUND, "Round");
            if (gameData.pause.left < 3)
                gameData.pause.left++;
            if (gameData.pause.right < 3)
                gameData.pause.right++;
        }
        gameData.updateScore = true;
        gameData.sendStatus = true;
    }
}
function handleMovement(gameData) {
    if (!gameData.playerLeft || !gameData.playerRight)
        return;
    if (gameData.mode === "Training") {
        if (gameData.playerLeft.id === Game_constants_1.AI_ID) {
            (0, handlePlayer_1.moveAI)(gameData, gameData.playerLeft, gameData.playerLeftDynamic, gameData.ball);
            (0, handlePlayer_1.updatePlayer)(gameData.playerRight, gameData.playerRightDynamic);
        }
        else if (gameData.playerRight.id === Game_constants_1.AI_ID) {
            (0, handlePlayer_1.moveAI)(gameData, gameData.playerRight, gameData.playerRightDynamic, gameData.ball);
            (0, handlePlayer_1.updatePlayer)(gameData.playerLeft, gameData.playerLeftDynamic);
        }
    }
    else {
        (0, handlePlayer_1.updatePlayer)(gameData.playerLeft, gameData.playerLeftDynamic);
        (0, handlePlayer_1.updatePlayer)(gameData.playerRight, gameData.playerRightDynamic);
    }
    if (gameData.playerServe && gameData.status === "Playing") {
        (0, handleBall_1.handleServe)(gameData.ball, gameData);
    }
    if (gameData.timer.end < new Date().getTime()) {
        const status = (0, handleBall_1.updateBall)(gameData.ball, gameData);
        if (status === "reset Left") {
            resetTurn("Right", gameData);
        }
        else if (status === "reset Right") {
            resetTurn("Left", gameData);
        }
    }
}
function updatePong(gameData) {
    handleMovement(gameData);
    handleRound(gameData);
    return gameData;
}
exports.updatePong = updatePong;
//# sourceMappingURL=updatePong.js.map