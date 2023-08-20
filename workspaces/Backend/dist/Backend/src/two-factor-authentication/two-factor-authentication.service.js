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
exports.TwoFactorAuthenticationService = void 0;
const mail_service_1 = require("../mail/mail.service");
const users_service_1 = require("../users/users.service");
const crypto_1 = require("../utils/crypto/crypto");
const common_1 = require("@nestjs/common");
const crypto_2 = require("crypto");
const otplib_1 = require("otplib");
let TwoFactorAuthenticationService = exports.TwoFactorAuthenticationService = class TwoFactorAuthenticationService {
    constructor(usersService, cryptoService, mailService) {
        this.usersService = usersService;
        this.cryptoService = cryptoService;
        this.mailService = mailService;
    }
    async generateTwoFactorAuthenticationSecret(user) {
        const secret = otplib_1.authenticator.generateSecret();
        const email = await this.cryptoService.decrypt(user.email);
        const otpauthUrl = otplib_1.authenticator.keyuri(email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
        const secretCrypted = await this.cryptoService.encrypt(secret);
        await this.usersService.updateUser(user.id, {
            twoFactorAuthenticationSecret: secretCrypted,
        });
        return {
            otpauthUrl,
            secret,
        };
    }
    async sendMail(user) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const bytes = (0, crypto_2.randomBytes)(8);
        const verifyCode = Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
        const email = await this.cryptoService.decrypt(user.email);
        await this.mailService.sendUser2faVerification(email, verifyCode);
        await this.usersService.updateUser(user.id, {
            expirationCode: Date.now() + 5 * 60 * 1000,
            verifyCode,
        });
    }
    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user) {
        const secret = await this.cryptoService.decrypt(user.twoFactorAuthenticationSecret);
        return otplib_1.authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret,
        });
    }
    async isBackupCodeValid(backupCode, user) {
        for (const backupCodeUser of user.backupCodes) {
            const backupCodeDecrypted = await this.cryptoService.decrypt(backupCodeUser.code);
            if (backupCodeDecrypted === backupCode) {
                this.usersService.deleteBackupCode(backupCodeUser);
                return true;
            }
        }
        return false;
    }
    generateBackupCode(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const bytes = (0, crypto_2.randomBytes)(length);
        const backupCode = Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
        return backupCode;
    }
    generateBackupCodes(count, length) {
        const backupCodes = [];
        for (let i = 0; i < count; i++) {
            backupCodes.push(this.generateBackupCode(length));
        }
        return backupCodes;
    }
    async updateBackupCodes(user) {
        await this.usersService.deleteBackupCodes(user);
        const backupCodes = this.generateBackupCodes(10, 10);
        const backupCodesCrypted = await Promise.all(backupCodes.map(backupCode => {
            return this.cryptoService.encrypt(backupCode);
        }));
        await Promise.all(backupCodesCrypted.map(backupCode => {
            this.usersService.saveBackupCode(user, backupCode);
        }));
    }
    async getBackupCodes(userId) {
        try {
            const user = await this.usersService.getUserBackupCodes(userId);
            if (!user)
                throw new Error("no user found");
            if (!user.backupCodes)
                await this.updateBackupCodes(user);
            const backupCodes = await Promise.all(user.backupCodes.map(backupCode => {
                return this.cryptoService.decrypt(backupCode.code);
            }));
            return backupCodes;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.TwoFactorAuthenticationService = TwoFactorAuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        crypto_1.CryptoService,
        mail_service_1.MailService])
], TwoFactorAuthenticationService);
//# sourceMappingURL=two-factor-authentication.service.js.map