"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const websockets_1 = require("@nestjs/websockets");
let WsJwtGuard = exports.WsJwtGuard = class WsJwtGuard {
    canActivate(context) {
        const client = context.switchToWs().getClient();
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const payload = (0, jsonwebtoken_1.verify)(bearerToken, process.env.JWT_SECRET);
            client.user = { id: payload.sub, login: payload.login };
            return true;
        }
        catch (err) {
            throw new websockets_1.WsException(err.message);
        }
    }
};
exports.WsJwtGuard = WsJwtGuard = __decorate([
    (0, common_1.Injectable)()
], WsJwtGuard);
//# sourceMappingURL=wsJwt.guard.js.map