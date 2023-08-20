import { Avatar } from "src/utils/typeorm/Avatar.entity";
export declare class channelDto {
    id: number;
    name: string;
    avatar: Avatar;
    type: 'public' | 'protected' | 'private' | 'privateMsg';
    joined: boolean;
}
