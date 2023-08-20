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
var JwtRefreshStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
let JwtRefreshStrategy = exports.JwtRefreshStrategy = JwtRefreshStrategy_1 = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "jwtRefresh") {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                JwtRefreshStrategy_1.extractJWT,
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET,
        });
    }
    static extractJWT(req) {
        if (req.cookies &&
            'refresh-token' in req.cookies &&
            req.cookies['refresh-token'].length > 0) {
            return req.cookies['refresh-token'];
        }
        return null;
    }
    async validate(payload) {
        return { id: payload.sub, login: payload.login };
    }
};
exports.JwtRefreshStrategy = JwtRefreshStrategy = JwtRefreshStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtRefreshStrategy);
//# sourceMappingURL=jwtRefresh.strategy.js.map