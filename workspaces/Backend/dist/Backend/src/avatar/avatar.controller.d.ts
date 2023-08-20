import { AvatarService } from './avatar.service';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
import { UsersService } from 'src/users/users.service';
export declare class AvatarController {
    private readonly avatarService;
    private readonly userService;
    constructor(avatarService: AvatarService, userService: UsersService);
    getAvatar(req: any): Promise<import("../utils/typeorm/Avatar.entity").Avatar | {
        exists: boolean;
    }>;
    getAvatarById(id: number, isChannel: boolean): Promise<import("../utils/typeorm/Avatar.entity").Avatar>;
    updateUserAvatar(req: any, updateUserAvatarDto: UpdateUserAvatarDto): Promise<ReturnData>;
}
