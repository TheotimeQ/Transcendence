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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const public_decorator_1 = require("../utils/decorators/public.decorator");
require("../utils/extensions/stringExtension");
const EditUser_dto_1 = require("./dto/EditUser.dto");
let UsersController = exports.UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getUserProfile(req) {
        const user = this.usersService.getUserById(req.user.id);
        if (!user)
            throw new common_1.NotFoundException();
        return user;
    }
    getUserProfileWithAvatar(req) {
        const user = this.usersService.getUserAvatar(req.user.id);
        if (!user)
            throw new common_1.NotFoundException();
        return user;
    }
    async getUserByLogin(id) {
        const user = await this.usersService.getUserById(id);
        if (!user)
            throw new common_1.NotFoundException();
        return user;
    }
    async getUserWithAvatar(id) {
        id = decodeURIComponent(id);
        const user = await this.usersService.getUserAvatar(parseInt(id));
        console.log('=== userWithAvatar ===\n', user);
        if (!user)
            throw new common_1.NotFoundException();
    }
    async checkDoubleEmail(email) {
        const decodeUrl = decodeURIComponent(email);
        const user = await this.usersService.getUserByEmail(decodeUrl, 'email');
        if (user)
            return {
                exists: true,
            };
        return {
            exists: false,
        };
    }
    async checkDoubleLogin(login) {
        try {
            const decodeUrl = decodeURIComponent(login);
            const user = await this.usersService.getUserByLogin(decodeUrl);
            if (user)
                return { exists: true };
            return { exists: false };
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.BadGatewayException();
        }
    }
    async editUser(req, properties) {
        return await this.usersService.editUser(req.user.id, properties);
    }
    async deleteTokens(id) {
        try {
            const user = await this.usersService.getUserTokens(id);
            if (user)
                return await this.usersService.deleteAllUserTokens(user);
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async deleteTokensByAccessToken(req) {
        try {
            const user = await this.usersService.getUserTokens(req.user.id);
            if (user)
                return await this.usersService.deleteAllUserTokens(user);
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async changeLogin(req, { login }) {
        try {
            const user = await this.usersService.getUserById(req.user.id);
            if (!user)
                throw new Error('no user found');
            const userWithLogin = await this.usersService.getUserByLogin(login);
            if (userWithLogin)
                return {
                    success: false,
                    error: 'exists',
                };
            this.usersService.updateUser(user.id, {
                login: login,
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
    async checkPassword(req, password) {
        return await this.usersService.checkPassword(req.user.id, password);
    }
    async updatePassword(req, password) {
        return await this.usersService.updatePassword(req.user.id, password);
    }
};
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Get)('myAvatar'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserProfileWithAvatar", null);
__decorate([
    (0, common_1.Get)('profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByLogin", null);
__decorate([
    (0, common_1.Get)('avatar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserWithAvatar", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('email'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkDoubleEmail", null);
__decorate([
    (0, common_1.Get)('login'),
    __param(0, (0, common_1.Query)('login')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkDoubleLogin", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('properties')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, EditUser_dto_1.EditUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "editUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)('disconnect/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteTokens", null);
__decorate([
    (0, common_1.Delete)('disconnectByToken'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteTokensByAccessToken", null);
__decorate([
    (0, common_1.Put)('changeLogin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, EditUser_dto_1.EditUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeLogin", null);
__decorate([
    (0, common_1.Post)('checkPassword'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkPassword", null);
__decorate([
    (0, common_1.Put)('updatePassword'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map