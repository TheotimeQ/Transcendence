"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPong = exports.initPlayer = exports.initBall = exports.initPlayerDynamic = void 0;
const Game_types_1 = require("../types/Game.types");
const Game_constants_1 = require("../constants/Game.constants");
function initPlayerDynamic(side, difficulty, actualRound) {
    return {
        posX: side === "Left" ? Game_constants_1.PLAYER_WIDTH * 3 : Game_constants_1.GAME_WIDTH - Game_constants_1.PLAYER_WIDTH * 4,
        posY: Game_constants_1.GAME_HEIGHT / 2 - Game_constants_1.PLAYER_HEIGHT / 2,
        speed: Game_constants_1.PLAYER_START_SPEED + difficulty + actualRound,
        move: Game_types_1.Action.Idle,
        push: 0,
    };
}
exports.initPlayerDynamic = initPlayerDynamic;
function initBall(difficulty, actualRound) {
    return {
        posX: Game_constants_1.GAME_WIDTH / 2 - Game_constants_1.BALL_SIZE / 2,
        posY: Game_constants_1.GAME_HEIGHT / 2 - Game_constants_1.BALL_SIZE / 2,
        speed: Game_constants_1.BALL_START_SPEED + difficulty + actualRound,
        moveX: 0,
        moveY: 0,
        push: 0,
    };
}
exports.initBall = initBall;
function initPlayer(side) {
    return {
        id: -1,
        name: "Searching",
        color: { r: 0, g: 0, b: 0, a: 0 },
        avatar: {
            image: "",
            variant: "",
            borderColor: "",
            backgroundColor: "",
            text: "",
            empty: true,
            decrypt: false,
        },
        side,
        host: false,
    };
}
exports.initPlayer = initPlayer;
function initPong(initData) {
    return {
        id: initData.id,
        name: initData.name,
        ball: initBall(initData.difficulty, initData.actualRound),
        playerLeft: initPlayer("Left"),
        playerRight: initPlayer("Right"),
        playerLeftDynamic: initPlayerDynamic("Left", initData.difficulty, initData.actualRound),
        playerRightDynamic: initPlayerDynamic("Right", initData.difficulty, initData.actualRound),
        playerLeftStatus: "Unknown",
        playerRightStatus: "Unknown",
        background: initData.background,
        ballImg: initData.ball,
        type: initData.type,
        mode: initData.mode,
        hostSide: initData.hostSide,
        difficulty: initData.difficulty,
        push: initData.push,
        playerServe: Math.random() < 0.5 ? "Left" : "Right",
        actualRound: initData.actualRound,
        maxPoint: initData.maxPoint,
        maxRound: initData.maxRound,
        score: initData.score,
        timer: {
            end: 0,
            reason: "Start",
        },
        pause: {
            active: initData.pause,
            left: 3,
            right: 3,
            status: "None",
        },
        status: "Not Started",
        result: "Not Finished",
        sendStatus: false,
        updateScore: false,
    };
}
exports.initPong = initPong;
//# sourceMappingURL=initPong.js.map