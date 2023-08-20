import { Avatar } from "src/utils/typeorm/Avatar.entity";
export declare class ChannelDto {
    name: string;
    avatar: Avatar;
    type: 'public' | 'protected' | 'private' | 'privateMsg';
}
