import { User } from 'src/utils/typeorm/User.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';
import { CryptoService } from 'src/utils/crypto/crypto';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { EditUserDto } from './dto/EditUser.dto';
import { repDto } from './dto/rep.dto';
import { Token } from 'src/utils/typeorm/Token.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { StatsService } from '@/stats/service/stats.service';
import { Notif } from '@/utils/typeorm/Notif.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly channelRepository;
    private readonly tokenRepository;
    private readonly backupCodeRepository;
    private readonly socketTokenRepository;
    private readonly notifRepository;
    private cryptoService;
    private readonly statsService;
    constructor(userRepository: Repository<User>, channelRepository: Repository<Channel>, tokenRepository: Repository<Token>, backupCodeRepository: Repository<BackupCode>, socketTokenRepository: Repository<SocketToken>, notifRepository: Repository<Notif>, cryptoService: CryptoService, statsService: StatsService);
    addUser(CreateUserDto: CreateUserDto): Promise<User>;
    saveUserEntity(user: User): Promise<User>;
    getUserByLogin(login: string): Promise<User>;
    getUserByEmail(email: string, provider: string): Promise<User>;
    getUserById(id: number): Promise<User>;
    getUserChannels(id: number): Promise<User>;
    getUserPongies(id: number): Promise<User>;
    getUserAvatar(id: number): Promise<User>;
    getUserBackupCodes(id: number): Promise<User>;
    getUserTokens(id: number): Promise<User>;
    saveToken(token: Token): Promise<void>;
    saveBackupCode(user: User, backupCode: string): Promise<BackupCode>;
    deleteToken(token: Token): Promise<void>;
    deleteBackupCode(backupCode: BackupCode): Promise<void>;
    deleteAllUserTokens(user: User): Promise<void>;
    deleteBackupCodes(user: User): Promise<void>;
    getUserByCode(code: string): Promise<User>;
    updateUser(id: number, properties: Partial<User>): Promise<void>;
    updateUserChannels(user: User, channel: Channel): Promise<void>;
    updateUserAvatar(user: User, avatar: Avatar): Promise<void>;
    updateUserPongies(user: User, pongie: User): Promise<void>;
    updateUserBackupCodes(user: User, backupCodes: BackupCode[]): Promise<void>;
    getChannelByName(name: string): Promise<Channel>;
    editUser(userId: number, properties: EditUserDto): Promise<repDto>;
    private log;
    checkPassword(userId: number, passwordCrypted: string): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    updatePassword(userId: number, password: string): Promise<{
        success: boolean;
    }>;
}
