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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_entity_1 = require("../utils/typeorm/User.entity");
const typeorm_2 = require("typeorm");
const crypto_1 = require("../utils/crypto/crypto");
const Channel_entity_1 = require("../utils/typeorm/Channel.entity");
const Token_entity_1 = require("../utils/typeorm/Token.entity");
const BackupCode_entity_1 = require("../utils/typeorm/BackupCode.entity");
const bcrypt = require("bcrypt");
const SocketToken_entity_1 = require("../utils/typeorm/SocketToken.entity");
const stats_service_1 = require("../stats/service/stats.service");
const Notif_entity_1 = require("../utils/typeorm/Notif.entity");
let UsersService = exports.UsersService = class UsersService {
    constructor(userRepository, channelRepository, tokenRepository, backupCodeRepository, socketTokenRepository, notifRepository, cryptoService, statsService) {
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.tokenRepository = tokenRepository;
        this.backupCodeRepository = backupCodeRepository;
        this.socketTokenRepository = socketTokenRepository;
        this.notifRepository = notifRepository;
        this.cryptoService = cryptoService;
        this.statsService = statsService;
    }
    async addUser(CreateUserDto) {
        const user = await this.userRepository.save(CreateUserDto);
        const newStats = {
            userId: user.id,
        };
        const stats = await this.statsService.createStats(newStats);
        await this.userRepository
            .createQueryBuilder()
            .relation(User_entity_1.User, 'stats')
            .of(user.id)
            .set(stats);
        const notif = await this.notifRepository.save(new Notif_entity_1.Notif());
        await this.userRepository
            .createQueryBuilder()
            .relation(User_entity_1.User, 'notif')
            .of(user.id)
            .set(notif);
        return user;
    }
    async saveUserEntity(user) {
        return await this.userRepository.save(user);
    }
    async getUserByLogin(login) {
        return await this.userRepository.findOne({ where: { login: login } });
    }
    async getUserByEmail(email, provider) {
        const emailDecrypted = (await this.cryptoService.decrypt(email)).toLowerCase();
        const clients = await this.userRepository.find();
        for (const client of clients) {
            const emailClient = await this.cryptoService.decrypt(client.email);
            if (emailClient.toLowerCase() === emailDecrypted &&
                client.provider === provider)
                return client;
        }
        return null;
    }
    async getUserById(id) {
        return await this.userRepository.findOne({
            where: { id: id },
        });
    }
    async getUserChannels(id) {
        return await this.userRepository.findOne({
            where: { id: id },
            relations: ['channels', 'channels.avatar', 'avatar'],
        });
    }
    async getUserPongies(id) {
        return await this.userRepository.findOne({
            where: { id: id },
            relations: ['pongies', 'pongies.avatar', 'avatar'],
        });
    }
    async getUserAvatar(id) {
        return await this.userRepository.findOne({
            where: { id: id },
            relations: ['avatar'],
        });
    }
    async getUserBackupCodes(id) {
        return await this.userRepository.findOne({
            where: { id: id },
            relations: ['backupCodes'],
        });
    }
    async getUserTokens(id) {
        return await this.userRepository.findOne({
            where: { id: id },
            relations: ['tokens'],
        });
    }
    async saveToken(token) {
        await this.tokenRepository.save(token);
    }
    async saveBackupCode(user, backupCode) {
        const backupCodeEntity = new BackupCode_entity_1.BackupCode();
        backupCodeEntity.code = backupCode;
        backupCodeEntity.user = user;
        return await this.backupCodeRepository.save(backupCodeEntity);
    }
    async deleteToken(token) {
        await this.tokenRepository.remove(token);
    }
    async deleteBackupCode(backupCode) {
        await this.backupCodeRepository.remove(backupCode);
    }
    async deleteAllUserTokens(user) {
        await this.tokenRepository.remove(user.tokens);
        const socketTokens = await this.socketTokenRepository.find({
            where: { userId: user.id },
        });
        await this.socketTokenRepository.remove(socketTokens);
    }
    async deleteBackupCodes(user) {
        await this.backupCodeRepository.remove(user.backupCodes);
    }
    async getUserByCode(code) {
        return await this.userRepository.findOne({
            where: { verifyCode: code, verified: false },
        });
    }
    async updateUser(id, properties) {
        await this.userRepository.update(id, properties);
    }
    async updateUserChannels(user, channel) {
        await this.userRepository
            .createQueryBuilder()
            .relation(User_entity_1.User, 'channels')
            .of(user.id)
            .add(channel);
    }
    async updateUserAvatar(user, avatar) {
        await this.userRepository
            .createQueryBuilder()
            .relation(User_entity_1.User, 'avatar')
            .of(user.id)
            .set(avatar);
    }
    async updateUserPongies(user, pongie) {
        await this.userRepository
            .createQueryBuilder()
            .relation(User_entity_1.User, 'pongies')
            .of(user.id)
            .add(pongie);
    }
    async updateUserBackupCodes(user, backupCodes) {
        await this.userRepository
            .createQueryBuilder()
            .relation(User_entity_1.User, 'backupCodes')
            .of(user.id)
            .set(backupCodes);
    }
    async getChannelByName(name) {
        return await this.channelRepository.findOne({
            where: { name: name },
            relations: ['users'],
        });
    }
    async editUser(userId, properties) {
        const rep = {
            success: false,
            message: '',
        };
        try {
            const updatedProperties = [];
            for (const key in properties) {
                if (properties.hasOwnProperty(key) && properties[key] !== undefined) {
                    updatedProperties.push(key);
                }
            }
            if (updatedProperties.length > 0) {
                if (updatedProperties.indexOf('login') !== -1) {
                    rep.message = 'sorry, editing login is not implemented yet';
                }
                else {
                    this.updateUser(userId, properties);
                    rep.success = true;
                    rep.message = `Properties : ${updatedProperties.join(', ')} : successfully updated`;
                    this.log(`${rep.message} for user : ${userId}`);
                }
            }
            else {
                rep.message = 'missing or incorrect properties sent in request';
            }
        }
        catch (error) {
            rep.message = error.message;
        }
        return rep;
    }
    log(message) {
        const yellow = '\x1b[33m';
        const stop = '\x1b[0m';
        process.stdout.write(yellow + '[user service]  ' + stop);
        console.log(message);
    }
    async checkPassword(userId, passwordCrypted) {
        try {
            if (!passwordCrypted)
                throw new Error('no password');
            const user = await this.getUserById(userId);
            if (!user)
                throw new Error('no user');
            const password = await this.cryptoService.decrypt(passwordCrypted);
            const isMatch = await bcrypt.compare(password, user.passwordHashed);
            if (!isMatch)
                return {
                    success: false,
                    error: 'wrong',
                };
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException();
        }
    }
    async updatePassword(userId, password) {
        try {
            if (!password)
                throw new Error('no password');
            const user = await this.getUserById(userId);
            if (!user)
                throw new Error('no user');
            await this.updateUser(user.id, {
                passwordHashed: password,
            });
            return {
                success: true,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException();
        }
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Channel_entity_1.Channel)),
    __param(2, (0, typeorm_1.InjectRepository)(Token_entity_1.Token)),
    __param(3, (0, typeorm_1.InjectRepository)(BackupCode_entity_1.BackupCode)),
    __param(4, (0, typeorm_1.InjectRepository)(SocketToken_entity_1.SocketToken)),
    __param(5, (0, typeorm_1.InjectRepository)(Notif_entity_1.Notif)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        crypto_1.CryptoService,
        stats_service_1.StatsService])
], UsersService);
//# sourceMappingURL=users.service.js.map