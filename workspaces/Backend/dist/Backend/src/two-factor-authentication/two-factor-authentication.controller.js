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
exports.TwoFactorAuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const two_factor_authentication_service_1 = require("./two-factor-authentication.service");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("../auth/services/auth.service");
const TwoFactorAuthenticationCode_dto_1 = require("./dto/TwoFactorAuthenticationCode.dto");
const VerifYCode_dto_1 = require("./dto/VerifYCode.dto");
const BackupCode_dto_1 = require("./dto/BackupCode.dto");
let TwoFactorAuthenticationController = exports.TwoFactorAuthenticationController = class TwoFactorAuthenticationController {
    constructor(twoFactorAuthenticationService, usersService, authService) {
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
        this.usersService = usersService;
        this.authService = authService;
    }
    async register(req) {
        try {
            const user = await this.usersService.getUserById(req.user.id);
            if (!user)
                throw new Error('no user found');
            return await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
        }
        catch (error) {
            throw new common_1.BadGatewayException(error.message);
        }
    }
    async sendCode(req) {
        try {
            const user = await this.usersService.getUserById(req.user.id);
            if (!user)
                throw new Error('no user found');
            this.twoFactorAuthenticationService.sendMail(user);
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.BadGatewayException();
        }
    }
    async verifyCode({ code }, req) {
        try {
            const user = await this.usersService.getUserById(req.user.id);
            if (!user)
                throw new Error('no user found');
            if (user.verifyCode !== code) {
                this.twoFactorAuthenticationService.sendMail(user);
                return {
                    success: false,
                    error: 'wrong code',
                };
            }
            if (user.expirationCode < Date.now()) {
                this.twoFactorAuthenticationService.sendMail(user);
                return {
                    success: false,
                    error: 'time out',
                };
            }
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.BadGatewayException();
        }
    }
    async activate({ twoFactorAuthenticationCode }, req) {
        try {
            const user = await this.usersService.getUserBackupCodes(req.user.id);
            if (!user)
                throw new Error('no user found');
            const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user);
            if (!isCodeValid)
                return {
                    success: false,
                    error: "wrong code",
                };
            this.twoFactorAuthenticationService.updateBackupCodes(user);
            this.usersService.updateUser(user.id, {
                isTwoFactorAuthenticationEnabled: true,
            });
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.BadGatewayException();
        }
    }
    async deactivate({ twoFactorAuthenticationCode }, req) {
        try {
            const user = await this.usersService.getUserById(req.user.id);
            if (!user)
                throw new Error('no user found');
            const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user);
            if (!isCodeValid)
                return {
                    success: false,
                    error: "wrong code",
                };
            this.usersService.updateUser(user.id, {
                isTwoFactorAuthenticationEnabled: false,
            });
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.BadGatewayException();
        }
    }
    async authenticate(req, { twoFactorAuthenticationCode }) {
        try {
            const user = await this.usersService.getUserById(req.user.id);
            if (!user)
                throw new Error('no user found');
            const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user);
            if (!isCodeValid)
                return {
                    success: false,
                    error: 'wrong code',
                };
            const { access_token, refresh_token } = await this.authService.login(user, 0, false);
            return {
                success: true,
                access_token,
                refresh_token,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async backupCodes(req) {
        return this.twoFactorAuthenticationService.getBackupCodes(req.user.id);
    }
    async verifyAuthCode(req, { twoFactorAuthenticationCode }) {
        try {
            const user = await this.usersService.getUserById(req.user.id);
            if (!user)
                throw new Error('no user found');
            const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user);
            if (!isCodeValid)
                return {
                    success: false,
                    error: 'wrong code',
                };
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadGatewayException();
        }
    }
    async getAccountBack(req, { backupCode }) {
        try {
            const user = await this.usersService.getUserBackupCodes(req.user.id);
            if (!user)
                throw new Error('no user found');
            const isCodeValid = await this.twoFactorAuthenticationService.isBackupCodeValid(backupCode, user);
            if (!isCodeValid)
                return {
                    success: false,
                    error: 'no code',
                };
            this.usersService.updateUser(user.id, {
                isTwoFactorAuthenticationEnabled: false,
            });
            const { access_token, refresh_token } = await this.authService.login(user, 0, false);
            return {
                success: true,
                access_token,
                refresh_token,
            };
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.BadGatewayException();
        }
    }
};
__decorate([
    (0, common_1.Get)('generate'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('sendCode'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "sendCode", null);
__decorate([
    (0, common_1.Post)('verifyCode'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifYCode_dto_1.VerifYCodeDto, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.Post)('activate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TwoFactorAuthenticationCode_dto_1.TwoFactorAuthenticationCodeDto, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)('deactivate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TwoFactorAuthenticationCode_dto_1.TwoFactorAuthenticationCodeDto, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)('authenticate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, TwoFactorAuthenticationCode_dto_1.TwoFactorAuthenticationCodeDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "authenticate", null);
__decorate([
    (0, common_1.Get)('backupCodes'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "backupCodes", null);
__decorate([
    (0, common_1.Post)('verifyAuthCode'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, TwoFactorAuthenticationCode_dto_1.TwoFactorAuthenticationCodeDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "verifyAuthCode", null);
__decorate([
    (0, common_1.Post)('getAccountBack'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BackupCode_dto_1.BackupCodeDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "getAccountBack", null);
exports.TwoFactorAuthenticationController = TwoFactorAuthenticationController = __decorate([
    (0, common_1.Controller)('2fa'),
    __metadata("design:paramtypes", [two_factor_authentication_service_1.TwoFactorAuthenticationService,
        users_service_1.UsersService,
        auth_service_1.AuthService])
], TwoFactorAuthenticationController);
//# sourceMappingURL=two-factor-authentication.controller.js.map