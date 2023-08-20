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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../utils/decorators/public.decorator");
const CreateUser_dto_1 = require("../users/dto/CreateUser.dto");
const google_oauth_guard_1 = require("./guards/google-oauth.guard");
const Avatar_dto_1 = require("../avatar/dto/Avatar.dto");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const auth_service_1 = require("./services/auth.service");
const http_exception_filter_1 = require("../utils/filter/http-exception.filter");
const jwtRefresh_guard_1 = require("./guards/jwtRefresh.guard");
let AuthController = exports.AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async logIn42(code, res) {
        try {
            if (!code)
                throw new Error('no code');
            const dataToken = await this.authService.getToken42(code);
            if (!dataToken)
                throw new Error('no 42 token');
            const user42logged = await this.authService.logUser(dataToken);
            if (!user42logged)
                throw new Error('no 42 user');
            const { access_token, refresh_token } = await this.authService.login(user42logged, 0, user42logged.isTwoFactorAuthenticationEnabled);
            res.cookie('crunchy-token', access_token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
            });
            res.cookie('refresh-token', refresh_token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
            });
            return res.redirect(`http://${process.env.HOST_IP}:3000/home/auth/connect`);
        }
        catch (error) {
            console.log(error);
            return res.redirect(`http://${process.env.HOST_IP}:3000/welcome/login/wrong`);
        }
    }
    async registerUser(createUserDto) {
        try {
            const user = await this.authService.addUser(createUserDto);
            if (!user)
                throw new common_1.BadRequestException();
            return {
                message: 'ok',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async verifyCode(code) {
        try {
            const user = await this.authService.verifyCode(code);
            if (!user)
                return { message: 'This code does not exist. Please try again!' };
            if (user && user.expirationCode < Date.now()) {
                await this.authService.sendNewCode(user);
                return {
                    message: 'This code has expired. A new one has been sent to your email address',
                };
            }
            await this.authService.updateUser(user.id, {
                verified: true,
            });
            const { access_token, refresh_token } = await this.authService.login(user, 0, user.isTwoFactorAuthenticationEnabled);
            return {
                message: 'Loading...',
                access_token,
                refresh_token,
            };
        }
        catch (error) {
            return {
                message: 'Something went wrong, please try again !',
            };
        }
    }
    async googleAuth() { }
    async googleOauthCallback(req, res) {
        try {
            const user = await this.authService.loginWithGoogle(req.user);
            const { access_token, refresh_token } = await this.authService.login(user, 0, user.isTwoFactorAuthenticationEnabled);
            res.cookie('crunchy-token', access_token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
            });
            res.cookie('refresh-token', refresh_token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
            });
            return res.redirect(`http://${process.env.HOST_IP}:3000/home/auth/connect`);
        }
        catch (error) {
            console.log(error);
            return res.redirect(`http://${process.env.HOST_IP}:3000/welcome/login/wrong`);
        }
    }
    async firstLogin(req, login, avatar) {
        try {
            if (login.length < 4)
                throw new Error('Login too short');
            const avatarCreated = await this.authService.createAvatar(avatar);
            const user = await this.authService.updateAvatarLogin(req.user.id, login, avatarCreated);
            const { access_token, refresh_token } = await this.authService.login(user, 0, false);
            return {
                error: false,
                access_token,
                refresh_token,
            };
        }
        catch (err) {
            return {
                error: true,
                message: err.message,
            };
        }
    }
    loginEmail(req) {
        return this.authService.login(req.user, 0, req.user.isTwoFactorAuthenticationEnabled);
    }
    async refresh(req, header) {
        const [, refreshToken] = header.split(' ');
        return this.authService.refreshToken(req.user.id, refreshToken);
    }
    async refreshToken(req) {
        const refreshToken = req.cookies['refresh-token'];
        return this.authService.refreshToken(req.user.id, refreshToken);
    }
    async sendPassword(req) {
        return await this.authService.sendPassword(req.user.id);
    }
    async forgotPassword(email) {
        return await this.authService.forgotPassword(email);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('42'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logIn42", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUser_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('verifyCode/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyCode", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOauthGuard),
    (0, common_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.Get)('google'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOauthGuard),
    (0, common_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleOauthCallback", null);
__decorate([
    (0, common_1.Post)('firstLogin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('login')),
    __param(2, (0, common_1.Body)('avatarChosen')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Avatar_dto_1.AvatarDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "firstLogin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginEmail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwtRefresh_guard_1.JwtRefreshGuard),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwtRefresh_guard_1.JwtRefreshGuard),
    (0, common_1.Post)('refreshToken'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('sendPassword'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgotPassword'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map