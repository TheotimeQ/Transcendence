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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const mail_service_1 = require("../../mail/mail.service");
const users_service_1 = require("../../users/users.service");
const crypto_2 = require("../../utils/crypto/crypto");
const avatar_service_1 = require("../../avatar/avatar.service");
const argon2 = require("argon2");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Token_entity_1 = require("../../utils/typeorm/Token.entity");
const jsonwebtoken_1 = require("jsonwebtoken");
let AuthService = exports.AuthService = class AuthService {
    constructor(usersService, avatarService, jwtService, mailService, cryptoService) {
        this.usersService = usersService;
        this.avatarService = avatarService;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.cryptoService = cryptoService;
    }
    async getToken42(code) {
        const response = await fetch('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.CLIENT_ID_42,
                client_secret: process.env.SECRET_42,
                code: code,
                redirect_uri: process.env.REDIRECT_42,
            }),
        });
        if (!response.ok)
            throw new Error('fetch failed');
        return await response.json();
    }
    async logUser(dataToken) {
        var _a;
        const response = await fetch('https://api.intra.42.fr/v2/me', {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + dataToken.access_token },
        });
        if (!response.ok)
            throw new Error('Api 42 fetch error');
        const content = await response.json();
        const user = {
            email: await this.cryptoService.encrypt(content === null || content === void 0 ? void 0 : content.email),
            first_name: await this.cryptoService.encrypt(content === null || content === void 0 ? void 0 : content.first_name),
            last_name: await this.cryptoService.encrypt(content === null || content === void 0 ? void 0 : content.last_name),
            phone: await this.cryptoService.encrypt(content === null || content === void 0 ? void 0 : content.phone),
            image: await this.cryptoService.encrypt((_a = content === null || content === void 0 ? void 0 : content.image) === null || _a === void 0 ? void 0 : _a.versions.large),
            verified: true,
            provider: '42',
        };
        const user_old = await this.usersService.getUserByEmail(user.email, '42');
        if (!user_old)
            return await this.usersService.addUser(user);
        await this.usersService.updateUser(user_old.id, {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            image: user.image,
        });
        return user_old;
    }
    async login(user, nbOfRefreshes, isTwoFactorAuthenticationEnabled) {
        const payload = {
            sub: user.id,
            login: user.login,
            twoFactorAuth: isTwoFactorAuthenticationEnabled,
        };
        let access_token = '';
        let refresh_token = '';
        if (!isTwoFactorAuthenticationEnabled) {
            [access_token, refresh_token] = await Promise.all([
                this.jwtService.signAsync(payload, {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '15m',
                }),
                this.jwtService.signAsync(payload, {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: '1d',
                }),
            ]);
            try {
                await this.updateRefreshToken(user, refresh_token, nbOfRefreshes);
            }
            catch (error) {
                console.log(error);
            }
        }
        else
            access_token = await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            });
        return {
            access_token,
            refresh_token,
        };
    }
    generateSecureCode(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const bytes = (0, crypto_1.randomBytes)(length);
        return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
    }
    async addUser(CreateUserDto) {
        CreateUserDto.expirationCode = Date.now() + 5 * 60 * 1000;
        CreateUserDto.verifyCode = this.generateSecureCode(8);
        CreateUserDto.verified = false;
        const email = await this.cryptoService.decrypt(CreateUserDto.email);
        await this.mailService.sendUserConfirmation(email, CreateUserDto.verifyCode);
        return await this.usersService.addUser(CreateUserDto);
    }
    async verifyCode(code) {
        return await this.usersService.getUserByCode(code);
    }
    async sendNewCode(user) {
        const verifyCode = this.generateSecureCode(8);
        const email = await this.cryptoService.decrypt(user.email);
        await this.mailService.sendUserConfirmation(email, verifyCode);
        await this.usersService.updateUser(user.id, {
            expirationCode: Date.now() + 5 * 60 * 1000,
            verifyCode,
        });
    }
    async loginWithGoogle(CreateUserDto) {
        if (!CreateUserDto)
            throw new Error('Unauthenticated');
        const encryptedValues = await Promise.all([
            this.cryptoService.encrypt(CreateUserDto.email),
            this.cryptoService.encrypt(CreateUserDto.first_name),
            this.cryptoService.encrypt(CreateUserDto.last_name),
            this.cryptoService.encrypt(CreateUserDto.image),
        ]);
        CreateUserDto.email = encryptedValues[0];
        CreateUserDto.first_name = encryptedValues[1];
        CreateUserDto.last_name = encryptedValues[2];
        CreateUserDto.image = encryptedValues[3];
        let user = await this.usersService.getUserByEmail(CreateUserDto.email, 'google');
        if (!user)
            user = await this.usersService.addUser(CreateUserDto);
        else
            await this.usersService.updateUser(user.id, CreateUserDto);
        return user;
    }
    async updateUser(id, properties) {
        await this.usersService.updateUser(id, properties);
    }
    async updateAvatarLogin(userId, login, avatar) {
        const user = await this.usersService.getUserById(userId);
        if (!user)
            throw new Error('No user found');
        user.login = login;
        await this.usersService.updateUser(user.id, {
            login: login,
        });
        await this.usersService.updateUserAvatar(user, avatar);
        return user;
    }
    async createAvatar(avatar) {
        return await this.avatarService.createAvatar(avatar);
    }
    async getUserById(id) {
        return await this.usersService.getUserById(id);
    }
    async updateRefreshToken(user, refreshToken, nbOfRefreshes) {
        const hashedRefreshToken = await argon2.hash(refreshToken);
        const token = new Token_entity_1.Token();
        token.user = user;
        token.value = hashedRefreshToken;
        token.NbOfRefreshes = nbOfRefreshes;
        await this.usersService.saveToken(token);
    }
    async findMatchingToken(refreshToken, tokens) {
        for (const token of tokens) {
            const isMatch = await argon2.verify(token.value, refreshToken);
            if (isMatch) {
                return token;
            }
        }
        return undefined;
    }
    async refreshToken(userId, refreshToken) {
        try {
            const user = await this.usersService.getUserTokens(userId);
            if (!user)
                throw new Error('no user found');
            const payload = (0, jsonwebtoken_1.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);
            if (!payload) {
                throw new Error('cannot verify token');
            }
            const isMatch = await this.findMatchingToken(refreshToken, user.tokens);
            if (!isMatch) {
                await this.usersService.deleteAllUserTokens(user);
                throw new Error('token not valid!');
            }
            if (isMatch.NbOfRefreshes >= 120) {
                await this.usersService.deleteAllUserTokens(user);
                throw new Error('Too long, needs to reconnect');
            }
            setTimeout(() => {
                this.usersService.deleteToken(isMatch);
            }, 20000);
            return this.login(user, isMatch.NbOfRefreshes + 1, false);
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async sendPassword(userId) {
        try {
            const user = await this.usersService.getUserById(userId);
            if (!user)
                throw new Error('no user found');
            const newPassword = this.generatePassword(20);
            const salt = await bcrypt.genSalt();
            const passwordHashed = await bcrypt.hash(newPassword, salt);
            await this.usersService.updateUser(user.id, {
                passwordHashed: passwordHashed,
            });
            const email = await this.cryptoService.decrypt(user.email);
            await this.mailService.sendUserNewPassword(email, newPassword);
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException();
        }
    }
    async forgotPassword(email) {
        try {
            if (!email)
                throw new Error('no email');
            const emailDecrypted = await this.cryptoService.decrypt(email);
            const user = await this.usersService.getUserByEmail(email, 'email');
            if (!user)
                throw new Error('no user found');
            const newPassword = this.generatePassword(20);
            const salt = await bcrypt.genSalt();
            const passwordHashed = await bcrypt.hash(newPassword, salt);
            await this.usersService.updateUser(user.id, {
                passwordHashed: passwordHashed,
            });
            await this.mailService.sendUserNewPassword(emailDecrypted, newPassword);
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException();
        }
    }
    generatePassword(length = 20) {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const digitChars = '0123456789';
        const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const allChars = uppercaseChars + lowercaseChars + digitChars + specialChars;
        const passwordChars = [];
        passwordChars.push(this.getRandomChar(uppercaseChars));
        passwordChars.push(this.getRandomChar(digitChars));
        passwordChars.push(this.getRandomChar(specialChars));
        for (let i = passwordChars.length; i < length; i++) {
            passwordChars.push(this.getRandomChar(allChars));
        }
        passwordChars.sort(() => Math.random() - 0.5);
        return passwordChars.join('');
    }
    getRandomChar(characters) {
        return characters.charAt(crypto.randomInt(0, characters.length));
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        avatar_service_1.AvatarService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        crypto_2.CryptoService])
], AuthService);
//# sourceMappingURL=auth.service.js.map