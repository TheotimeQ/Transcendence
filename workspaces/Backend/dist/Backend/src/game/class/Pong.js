"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pong = void 0;
const websockets_1 = require("@nestjs/websockets");
const pongUtils_1 = require("../../../../Shared/game/pongUtils");
const initPong_1 = require("../../../../Shared/game/initPong");
const updatePong_1 = require("../../../../Shared/game/updatePong");
const Game_constants_1 = require("../../../../Shared/constants/Game.constants");
class Pong {
    constructor(server, gameId, gameDB, gameService, scoreService, statsService, logger, score) {
        this.server = server;
        this.gameId = gameId;
        this.gameDB = gameDB;
        this.gameService = gameService;
        this.scoreService = scoreService;
        this.statsService = statsService;
        this.logger = logger;
        this.lastTimestamp = 0;
        this.isGameLoopRunning = false;
        this.framesThisSecond = 0;
        this.lastFpsUpdate = 0;
        this.currentFps = 0;
        this.updateGameInterval = null;
        this.disconnectLoopRunning = null;
        this.pauseLoopRunning = null;
        this.playerLeft = null;
        this.playerRight = null;
        this.spectators = [];
        if (this.gameDB) {
            const initData = {
                id: this.gameDB.id,
                name: this.gameDB.name,
                type: this.gameDB.type,
                mode: this.gameDB.mode,
                hostSide: this.gameDB.hostSide,
                actualRound: this.gameDB.actualRound,
                maxPoint: this.gameDB.maxPoint,
                maxRound: this.gameDB.maxRound,
                difficulty: this.gameDB.difficulty,
                push: this.gameDB.push,
                pause: this.gameDB.pause,
                background: this.gameDB.background,
                ball: this.gameDB.ball,
                score: score,
            };
            this.data = (0, initPong_1.initPong)(initData);
        }
    }
    async initPlayer() {
        try {
            this.data.playerLeft = await this.gameService.definePlayer(this.gameDB.hostSide === 'Left'
                ? this.gameDB.host
                : this.gameDB.opponent, 'Left', this.gameDB.hostSide === 'Left');
            this.data.playerLeftStatus = 'Disconnected';
            this.data.playerRight = await this.gameService.definePlayer(this.gameDB.hostSide === 'Right'
                ? this.gameDB.host
                : this.gameDB.opponent, 'Right', this.gameDB.hostSide === 'Right');
            this.data.playerRightStatus = 'Disconnected';
        }
        catch (error) {
            this.logger.error(`Error Initializing Players: ${error.message}`, 'Pong - initPlayer', error);
            throw new websockets_1.WsException('Error while initializing players');
        }
    }
    async join(user) {
        const data = {
            success: false,
            message: '',
        };
        if (this.gameDB.opponent === -1) {
            try {
                this.gameDB.opponent = await this.gameService.checkOpponent(this.gameDB.id);
            }
            catch (error) {
                this.logger.error(`Error Updating game opponent: ${error.message}`, 'Pong - Join', error);
                throw new websockets_1.WsException('Error while updating game opponent');
            }
        }
        if (user.id === this.gameDB.host || user.id === this.gameDB.opponent) {
            try {
                await this.joinAsPlayer(user);
                this.logger.log(`User ${user.id} joined ${this.gameId} as ${user.id === this.gameDB.host ? 'Host' : 'Opponent'}`, 'Pong - Join');
            }
            catch (error) {
                this.logger.error(`Error Joining as player: ${error.message}`, 'Pong - Join', error);
                throw new websockets_1.WsException('Error while joining as player');
            }
        }
        else {
            this.spectators.push(user);
            this.logger.log(`User ${user.id} joined ${this.gameId} as Spectator`, 'Pong - Join');
        }
        user.socket.join(this.gameId);
        data.success = true;
        data.message = 'User joined game';
        data.data = this.data;
        return data;
    }
    pauseLoop(side) {
        if (!this.disconnectLoopRunning && this.pauseLoopRunning) {
            const actualTime = new Date().getTime();
            if (actualTime >= this.data.timer.end) {
                this.data.status = 'Playing';
                this.data.sendStatus = true;
                this.data.timer = (0, pongUtils_1.defineTimer)(Game_constants_1.TIMER_RESTART, 'ReStart', side === 'Left'
                    ? this.data.playerLeft.name
                    : this.data.playerRight.name);
                this.data.sendStatus = true;
                this.pauseLoopRunning = null;
            }
            else {
                setTimeout(() => {
                    this.pauseLoop(side);
                }, 1000);
            }
        }
    }
    startPauseLoop(side) {
        if (!this.disconnectLoopRunning) {
            this.pauseLoopRunning = side;
            this.pauseLoop(side);
        }
    }
    stopPauseLoop() {
        if (!this.disconnectLoopRunning) {
            this.pauseLoopRunning = null;
        }
    }
    handleStop(action) {
        if (this.data.status === 'Playing') {
            if (this.playerLeft.id === action.userId && this.data.pause.left) {
                this.data.pause.left--;
                this.data.pause.status = 'Left';
            }
            else if (this.playerRight.id === action.userId &&
                this.data.pause.right) {
                this.data.pause.right--;
                this.data.pause.status = 'Right';
            }
            else
                return;
            this.data.status = 'Stopped';
            this.data.sendStatus = true;
            this.data.timer = (0, pongUtils_1.defineTimer)(Game_constants_1.TIMER_PAUSE, 'Pause', this.playerLeft.id === action.userId
                ? this.data.playerLeft.name
                : this.data.playerRight.name);
            this.startPauseLoop(this.playerLeft.id === action.userId ? 'Left' : 'Right');
        }
        else if (this.data.status === 'Stopped') {
            if (this.playerLeft.id === action.userId &&
                this.data.pause.status === 'Right') {
                return;
            }
            else if (this.playerRight.id === action.userId &&
                this.data.pause.status === 'Left') {
                return;
            }
            this.data.status = 'Playing';
            this.data.sendStatus = true;
            this.data.timer = (0, pongUtils_1.defineTimer)(Game_constants_1.TIMER_RESTART, 'ReStart', this.playerLeft.id === action.userId
                ? this.data.playerLeft.name
                : this.data.playerRight.name);
            this.stopPauseLoop();
        }
    }
    handlePush(action) {
        if (this.playerLeft.id === action.userId &&
            !this.data.playerLeftDynamic.push)
            this.data.playerLeftDynamic.push = 1;
        else if (this.playerRight.id === action.userId &&
            !this.data.playerRightDynamic.push)
            this.data.playerRightDynamic.push = 1;
    }
    playerAction(action) {
        if (this.playerLeft.id === action.userId ||
            this.playerRight.id === action.userId) {
            if (action.move === 'Stop' && this.data.pause.active) {
                this.handleStop(action);
            }
            else if (action.move === 'Push') {
                this.handlePush(action);
            }
            else {
                if (this.playerLeft.id === action.userId)
                    this.data.playerLeftDynamic.move = action.move;
                else if (this.playerRight.id === action.userId)
                    this.data.playerRightDynamic.move = action.move;
            }
        }
    }
    sendPlayerData(player) {
        this.server.to(this.gameId).emit('player', player);
        this.logger.log("Player's data sent", 'Pong - sendPlayerDatas');
    }
    sendStatus() {
        const status = {
            status: this.data.status,
            result: this.data.result,
            playerLeft: this.data.playerLeftStatus,
            playerRight: this.data.playerRightStatus,
            timer: this.data.timer,
            pause: this.data.pause,
        };
        this.server.to(this.gameId).emit('status', status);
    }
    sendUpdate() {
        const update = {
            playerLeftDynamic: this.data.playerLeftDynamic,
            playerRightDynamic: this.data.playerRightDynamic,
            ball: this.data.ball,
            score: this.data.score,
            actualRound: this.data.actualRound,
        };
        this.server.to(this.gameId).emit('update', update);
    }
    startGameLoop() {
        if (!this.isGameLoopRunning) {
            this.isGameLoopRunning = true;
            this.lastTimestamp = performance.now();
            this.updateGameInterval = setInterval(() => this.gameLoop(), Game_constants_1.BACK_FPS);
        }
    }
    gameLoop() {
        const timestamp = performance.now();
        this.lastTimestamp = timestamp;
        if (this.data.status === 'Playing') {
            (0, updatePong_1.updatePong)(this.data);
            this.sendUpdate();
            if (this.data.updateScore) {
                this.updateDBScore();
                this.data.updateScore = false;
            }
        }
        if (this.data.sendStatus) {
            this.updateDBStatus();
            this.sendStatus();
            this.data.sendStatus = false;
            if (this.data.status === 'Finished') {
                this.stopGameLoop();
                this.updateDBStats();
            }
        }
        this.framesThisSecond++;
        if (timestamp > this.lastFpsUpdate + 1000) {
            this.currentFps = this.framesThisSecond;
            this.framesThisSecond = 0;
            this.lastFpsUpdate = timestamp;
        }
    }
    stopGameLoop() {
        this.isGameLoopRunning = false;
        if (this.updateGameInterval) {
            clearTimeout(this.updateGameInterval);
            this.updateGameInterval = null;
        }
    }
    async updateDBScore() {
        try {
            if (this.data.actualRound > 0 &&
                this.data.score.round[this.data.actualRound].left === 0 &&
                this.data.score.round[this.data.actualRound].right === 0) {
                await this.scoreService.updateScore(this.gameId, this.data.score, this.data.actualRound, true);
            }
            else {
                await this.scoreService.updateScore(this.gameId, this.data.score, this.data.actualRound, false);
            }
        }
        catch (error) {
            this.logger.error(`Error Updating Score: ${error.message}`, 'Pong - updateDBScore', error);
        }
    }
    async updateDBStatus() {
        try {
            await this.gameService.updateStatus(this.gameId, this.data.status, this.data.result, this.data.actualRound);
        }
        catch (error) {
            this.logger.error(`Error Updating Status: ${error.message}`, 'Pong - updateDBStatus', error);
        }
    }
    async updateDBStats() {
        try {
            await this.statsService.updateStats(this.data.playerLeft.id, this.data.type, this.data.mode, 'Left', this.data.score, this.data.maxRound);
            await this.statsService.updateStats(this.data.playerRight.id, this.data.type, this.data.mode, 'Right', this.data.score, this.data.maxRound);
        }
        catch (error) {
            this.logger.error(`Error Updating Stats: ${error.message}`, 'Pong - updateDBStats', error);
        }
    }
    async joinAsPlayer(user) {
        if (user.id === this.gameDB.host) {
            this.joinAsHost(user);
        }
        else if (user.id === this.gameDB.opponent) {
            try {
                await this.joinAsOpponent(user);
            }
            catch (error) {
                this.logger.error(`Error Joining as opponent: ${error.message}`, 'Pong - JoinAsOpponent', error);
                throw new websockets_1.WsException('Error while joining as opponent');
            }
        }
        if (this.playerLeft &&
            this.data.playerLeftStatus === 'Connected' &&
            this.playerRight &&
            this.data.playerRightStatus === 'Connected') {
            if (this.data.status === 'Not Started') {
                this.data.status = 'Playing';
                this.data.sendStatus = true;
                this.startGameLoop();
                this.data.timer = (0, pongUtils_1.defineTimer)(Game_constants_1.TIMER_START, 'Start');
            }
            else if (this.data.status === 'Stopped') {
                this.data.status = 'Playing';
                this.data.sendStatus = true;
                this.startGameLoop();
                this.data.timer = (0, pongUtils_1.defineTimer)(Game_constants_1.TIMER_RESTART, 'ReStart');
            }
        }
    }
    joinAsHost(user) {
        user.isPlayer = true;
        if (this.gameDB.hostSide === 'Left') {
            this.playerLeft = user;
            this.data.playerLeftStatus = 'Connected';
            if (this.disconnectLoopRunning === 'Left')
                this.stopDisconnectLoop();
        }
        else if (this.gameDB.hostSide === 'Right') {
            this.playerRight = user;
            this.data.playerRightStatus = 'Connected';
            if (this.disconnectLoopRunning === 'Right')
                this.stopDisconnectLoop();
        }
    }
    async joinAsOpponent(user) {
        user.isPlayer = true;
        if (this.gameDB.hostSide === 'Left') {
            this.playerRight = user;
            if (this.data.playerRight.id === -1) {
                this.data.playerRight = await this.gameService.definePlayer(user.id, 'Right', false);
                this.sendPlayerData(this.data.playerRight);
            }
            this.data.playerRightStatus = 'Connected';
            if (this.disconnectLoopRunning === 'Left')
                this.stopDisconnectLoop();
        }
        else if (this.gameDB.hostSide === 'Right') {
            this.playerLeft = user;
            if (this.data.playerLeft.id === -1) {
                this.data.playerLeft = await this.gameService.definePlayer(user.id, 'Left', false);
                this.sendPlayerData(this.data.playerLeft);
            }
            this.data.playerLeftStatus = 'Connected';
            if (this.disconnectLoopRunning === 'Left')
                this.stopDisconnectLoop();
        }
    }
    async disconnect(user, manual) {
        const data = {
            success: false,
            message: '',
        };
        if (this.playerLeft && this.playerLeft === user) {
            this.playerLeft = null;
            if (manual && this.data.status === 'Playing')
                this.rageQuit('Left');
            else
                this.disconnectPlayer('Left');
        }
        else if (this.playerRight && this.playerRight === user) {
            this.playerRight = null;
            if (manual && this.data.status === 'Playing')
                this.rageQuit('Right');
            else
                this.disconnectPlayer('Right');
        }
        else {
            if (this.spectators.length === 0) {
                data.message = 'No spectators in the game';
                return data;
            }
            this.spectators = this.spectators.filter((spectator) => spectator !== user);
        }
        user.socket.leave(this.gameId);
        data.success = true;
        data.message = 'User disconnected from game';
        return data;
    }
    disconnectLoop(side) {
        if (this.disconnectLoopRunning) {
            const actualTime = new Date().getTime();
            if (actualTime > this.data.timer.end) {
                this.data.status = 'Finished';
                if (side === 'Left') {
                    this.data.result =
                        this.gameDB.hostSide === 'Left' ? 'Opponent' : 'Host';
                    this.data.score.disconnect = 'Left';
                }
                else if (side === 'Right') {
                    this.data.result =
                        this.gameDB.hostSide === 'Right' ? 'Opponent' : 'Host';
                    this.data.score.disconnect = 'Right';
                }
                this.data.sendStatus = true;
            }
            else {
                setTimeout(() => {
                    this.disconnectLoop(side);
                }, 1000);
            }
        }
    }
    startDisconnectLoop(side) {
        if (!this.disconnectLoopRunning) {
            this.disconnectLoopRunning = side;
            this.disconnectLoop(side);
        }
    }
    stopDisconnectLoop() {
        this.disconnectLoopRunning = null;
    }
    disconnectPlayer(side) {
        if (side === 'Left') {
            this.data.playerLeftStatus = 'Disconnected';
            if (this.data.status === 'Playing') {
                this.data.status = 'Stopped';
                this.data.sendStatus = true;
                this.data.timer = (0, pongUtils_1.defineTimer)(Game_constants_1.TIMER_DECONNECTION, 'Deconnection', this.data.playerLeft.name);
                if (this.data.playerRightStatus === 'Connected')
                    this.startDisconnectLoop('Left');
                else
                    this.stopDisconnectLoop();
            }
        }
        else if (side === 'Right') {
            this.data.playerRightStatus = 'Disconnected';
            if (this.data.status === 'Playing') {
                this.data.status = 'Stopped';
                this.data.sendStatus = true;
                this.data.timer = (0, pongUtils_1.defineTimer)(Game_constants_1.TIMER_DECONNECTION, 'Deconnection', this.data.playerRight.name);
                if (this.data.playerLeftStatus === 'Connected')
                    this.startDisconnectLoop('Right');
                else
                    this.stopDisconnectLoop();
            }
        }
    }
    rageQuit(side) {
        this.data.status = 'Finished';
        this.data.sendStatus = true;
        if (side === 'Left') {
            this.data.result = this.gameDB.hostSide === 'Left' ? 'Opponent' : 'Host';
            this.data.score.rageQuit = 'Left';
            this.scoreService.updateRageQuit(this.gameId, 'Left');
        }
        else if (side === 'Right') {
            this.data.result = this.gameDB.hostSide === 'Right' ? 'Opponent' : 'Host';
            this.data.score.rageQuit = 'Right';
            this.scoreService.updateRageQuit(this.gameId, 'Right');
        }
    }
}
exports.Pong = Pong;
//# sourceMappingURL=Pong.js.map