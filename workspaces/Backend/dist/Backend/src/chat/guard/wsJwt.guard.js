"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const websockets_1 = require("@nestjs/websockets");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const SocketToken_entity_1 = require("../../utils/typeorm/SocketToken.entity");
const crypto_1 = require("../../utils/crypto/crypto");
let WsJwtGuard = exports.WsJwtGuard = class WsJwtGuard {
    constructor(socketTokenRepository, cryptoService) {
        this.socketTokenRepository = socketTokenRepository;
        this.cryptoService = cryptoService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const payload = (0, jsonwebtoken_1.verify)(bearerToken, process.env.JWT_SECRET, {
                ignoreExpiration: true,
            });
            if (payload.exp + 2700 < Date.now()) {
                const socketTokens = await this.socketTokenRepository.find({
                    where: { userId: payload.sub },
                });
                const socketToken = await this.findSocketTokenByBearerToken(socketTokens, bearerToken);
                if (!socketToken)
                    throw new Error('token already expired');
            }
            client.user = { id: payload.sub, login: payload.login };
            return true;
        }
        catch (err) {
            console.log(err.message);
            throw new websockets_1.WsException('invalid token');
        }
    }
    async findSocketTokenByBearerToken(socketTokens, bearerToken) {
        for (const token of socketTokens) {
            const value = await this.cryptoService.decrypt(token.value);
            if (value === bearerToken) {
                return token;
            }
        }
        return undefined;
    }
};
exports.WsJwtGuard = WsJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(SocketToken_entity_1.SocketToken)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        crypto_1.CryptoService])
], WsJwtGuard);
//# sourceMappingURL=wsJwt.guard.js.map