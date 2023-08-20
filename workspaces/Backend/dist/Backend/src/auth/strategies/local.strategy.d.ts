import { UsersService } from '@/users/users.service';
import { CryptoService } from '@/utils/crypto/crypto';
import { User } from '@/utils/typeorm/User.entity';
import { AuthService } from '../services/auth.service';
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    private usersService;
    private cryptoService;
    constructor(authService: AuthService, usersService: UsersService, cryptoService: CryptoService);
    validate(email: string, password: string): Promise<User>;
}
export {};
