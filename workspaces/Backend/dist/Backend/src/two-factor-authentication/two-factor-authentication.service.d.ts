import { MailService } from "@/mail/mail.service";
import { UsersService } from "@/users/users.service";
import { CryptoService } from "@/utils/crypto/crypto";
import { User } from "@/utils/typeorm/User.entity";
export declare class TwoFactorAuthenticationService {
    private readonly usersService;
    private readonly cryptoService;
    private readonly mailService;
    constructor(usersService: UsersService, cryptoService: CryptoService, mailService: MailService);
    generateTwoFactorAuthenticationSecret(user: User): Promise<{
        otpauthUrl: string;
        secret: string;
    }>;
    sendMail(user: User): Promise<void>;
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User): Promise<boolean>;
    isBackupCodeValid(backupCode: string, user: User): Promise<boolean>;
    private generateBackupCode;
    generateBackupCodes(count: number, length: number): string[];
    updateBackupCodes(user: User): Promise<void>;
    getBackupCodes(userId: number): Promise<string[]>;
}
