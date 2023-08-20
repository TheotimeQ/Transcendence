import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { Response } from 'express';
import { AvatarDto } from 'src/avatar/dto/Avatar.dto';
import { AuthService } from './services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    logIn42(code: string, res: Response): Promise<void>;
    registerUser(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    verifyCode(code: string): Promise<{
        message: string;
        access_token?: undefined;
        refresh_token?: undefined;
    } | {
        message: string;
        access_token: string;
        refresh_token: string;
    }>;
    googleAuth(): Promise<void>;
    googleOauthCallback(req: any, res: Response): Promise<void>;
    firstLogin(req: any, login: string, avatar: AvatarDto): Promise<{
        error: boolean;
        access_token: string;
        refresh_token: string;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        access_token?: undefined;
        refresh_token?: undefined;
    }>;
    loginEmail(req: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(req: any, header: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshToken(req: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    sendPassword(req: any): Promise<{
        success: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
}
