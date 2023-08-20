import { ChannelService } from 'src/channels/channel.service';
import { UsersService } from 'src/users/users.service';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { Repository } from 'typeorm';
import { AvatarDto } from './dto/Avatar.dto';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
export declare class AvatarService {
    private readonly avatarRepository;
    private readonly usersService;
    private readonly channelService;
    constructor(avatarRepository: Repository<Avatar>, usersService: UsersService, channelService: ChannelService);
    createAvatar(avatarDto: AvatarDto): Promise<AvatarDto & Avatar>;
    getAvatarById(id: number, isChannel: boolean): Promise<Avatar>;
    editUserAvatarColors(req: any, updateUserAvatarDto: UpdateUserAvatarDto): Promise<ReturnData>;
    editChannelAvatarColors(req: any, updateUserAvatarDto: UpdateUserAvatarDto): Promise<ReturnData>;
    private createDefaultAvatar;
    private log;
}
