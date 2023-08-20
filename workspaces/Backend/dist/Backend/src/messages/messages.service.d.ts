import { ChannelService } from 'src/channels/channel.service';
import { sendMsgDto } from 'src/chat/dto/sendMsg.dto';
import { UsersService } from 'src/users/users.service';
import { Message } from 'src/utils/typeorm/Message.entity';
import { Repository } from 'typeorm';
export declare class MessagesService {
    private readonly messageRepository;
    private readonly channelService;
    private readonly userService;
    constructor(messageRepository: Repository<Message>, channelService: ChannelService, userService: UsersService);
    addMessage(message: sendMsgDto): Promise<void>;
}
