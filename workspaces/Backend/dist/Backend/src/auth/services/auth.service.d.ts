import { JwtService } from '@nestjs/jwt';
import dataAPI42 from 'src/utils/interfaces/dataAPI42.interface';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/utils/typeorm/User.entity';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'src/utils/crypto/crypto';
import { AvatarService } from 'src/avatar/avatar.service';
import { AvatarDto } from 'src/avatar/dto/Avatar.dto';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { Token } from 'src/utils/typeorm/Token.entity';
export declare class AuthService {
    private usersService;
    private avatarService;
    private jwtService;
    private mailService;
    private cryptoService;
    constructor(usersService: UsersService, avatarService: AvatarService, jwtService: JwtService, mailService: MailService, cryptoService: CryptoService);
    getToken42(code: string): Promise<dataAPI42>;
    logUser(dataToken: dataAPI42): Promise<User>;
    login(user: User, nbOfRefreshes: number, isTwoFactorAuthenticationEnabled: boolean): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    private generateSecureCode;
    addUser(CreateUserDto: CreateUserDto): Promise<User>;
    verifyCode(code: string): Promise<User>;
    sendNewCode(user: User): Promise<void>;
    loginWithGoogle(CreateUserDto: CreateUserDto): Promise<User>;
    updateUser(id: number, properties: Partial<User>): Promise<void>;
    updateAvatarLogin(userId: number, login: string, avatar: Avatar): Promise<User>;
    createAvatar(avatar: AvatarDto): Promise<AvatarDto & Avatar>;
    getUserById(id: number): Promise<User>;
    updateRefreshToken(user: User, refreshToken: string, nbOfRefreshes: number): Promise<void>;
    findMatchingToken(refreshToken: string, tokens: Token[]): Promise<Token | undefined>;
    refreshToken(userId: number, refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    sendPassword(userId: number): Promise<{
        success: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    private generatePassword;
    private getRandomChar;
}
