"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
const colored_logger_1 = require("../colored-logger");
class UserInfo {
    constructor(id, socket, gameId, isPlayer) {
        this.id = id;
        this.socket = socket;
        this.gameId = gameId;
        this.isPlayer = isPlayer;
        this.pingSend = 0;
        this.logger = new colored_logger_1.ColoredLogger(UserInfo.name);
    }
    sendPing() {
        this.socket.emit('ping');
        this.pingSend++;
    }
}
exports.UserInfo = UserInfo;
//# sourceMappingURL=UserInfo.js.map