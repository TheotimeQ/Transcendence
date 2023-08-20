import { ChannelService } from './channel.service';
import { EditChannelRelationDto } from './dto/EditChannelRelation.dto';
export declare class ChannelController {
    private readonly channelService;
    constructor(channelService: ChannelService);
    getChannelById(req: any, id: number): Promise<{
        channel: import("../utils/typeorm/Channel.entity").Channel;
        usersRelation: import("../utils/typeorm/UserChannelRelation").UserChannelRelation[];
    }>;
    editRelation(req: any, newRelation: EditChannelRelationDto): Promise<ReturnData>;
}
