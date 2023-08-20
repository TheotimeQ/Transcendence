import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { UsersService } from '@/users/users.service';
import { AuthService } from '@/auth/services/auth.service';
import { TwoFactorAuthenticationCodeDto } from './dto/TwoFactorAuthenticationCode.dto';
import { VerifYCodeDto } from './dto/VerifYCode.dto';
import { BackupCodeDto } from './dto/BackupCode.dto';
export declare class TwoFactorAuthenticationController {
    private readonly twoFactorAuthenticationService;
    private readonly usersService;
    private readonly authService;
    constructor(twoFactorAuthenticationService: TwoFactorAuthenticationService, usersService: UsersService, authService: AuthService);
    register(req: any): Promise<{
        otpauthUrl: string;
        secret: string;
    }>;
    sendCode(req: any): Promise<void>;
    verifyCode({ code }: VerifYCodeDto, req: any): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    activate({ twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto, req: any): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    deactivate({ twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto, req: any): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    authenticate(req: any, { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto): Promise<{
        success: boolean;
        error: string;
        access_token?: undefined;
        refresh_token?: undefined;
    } | {
        success: boolean;
        access_token: string;
        refresh_token: string;
        error?: undefined;
    }>;
    backupCodes(req: any): Promise<string[]>;
    verifyAuthCode(req: any, { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    getAccountBack(req: any, { backupCode }: BackupCodeDto): Promise<{
        success: boolean;
        error: string;
        access_token?: undefined;
        refresh_token?: undefined;
    } | {
        success: boolean;
        access_token: string;
        refresh_token: string;
        error?: undefined;
    }>;
}
