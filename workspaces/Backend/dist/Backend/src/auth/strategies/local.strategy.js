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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_local_1 = require("passport-local");
const users_service_1 = require("../../users/users.service");
const crypto_1 = require("../../utils/crypto/crypto");
const bcrypt = require("bcrypt");
const auth_service_1 = require("../services/auth.service");
let LocalStrategy = exports.LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService, usersService, cryptoService) {
        super({
            usernameField: 'email',
        });
        this.authService = authService;
        this.usersService = usersService;
        this.cryptoService = cryptoService;
    }
    async validate(email, password) {
        let user;
        try {
            user = await this.usersService.getUserByEmail(email, 'email');
        }
        catch (error) {
            throw new common_1.BadGatewayException();
        }
        if (!user)
            throw new common_1.NotFoundException();
        const passDecrypted = await this.cryptoService.decrypt(password);
        const isMatch = await bcrypt.compare(passDecrypted, user.passwordHashed);
        if (!isMatch)
            throw new common_1.UnauthorizedException();
        if (!user.verified) {
            this.authService.sendNewCode(user);
            throw new common_1.ForbiddenException();
        }
        return user;
    }
};
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        crypto_1.CryptoService])
], LocalStrategy);
//# sourceMappingURL=local.strategy.js.map