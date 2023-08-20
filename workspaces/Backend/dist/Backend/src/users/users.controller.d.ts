import { UsersService } from './users.service';
import 'src/utils/extensions/stringExtension';
import { EditUserDto } from './dto/EditUser.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUserProfile(req: any): Promise<import("../utils/typeorm/User.entity").User>;
    getUserProfileWithAvatar(req: any): Promise<import("../utils/typeorm/User.entity").User>;
    getUserByLogin(id: number): Promise<import("../utils/typeorm/User.entity").User>;
    getUserWithAvatar(id: string): Promise<void>;
    checkDoubleEmail(email: string): Promise<{
        exists: boolean;
    }>;
    checkDoubleLogin(login: string): Promise<{
        exists: boolean;
    }>;
    editUser(req: any, properties: EditUserDto): Promise<import("./dto/rep.dto").repDto>;
    deleteTokens(id: number): Promise<void>;
    deleteTokensByAccessToken(req: any): Promise<void>;
    changeLogin(req: any, { login }: EditUserDto): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    checkPassword(req: any, password: string): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    updatePassword(req: any, password: string): Promise<{
        success: boolean;
    }>;
}
