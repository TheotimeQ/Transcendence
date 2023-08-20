declare class NewRelationDto {
    isChanOp?: boolean;
    isBanned?: boolean;
    joined?: boolean;
    invited?: boolean;
}
export declare class EditChannelRelationDto {
    channelId: number;
    userId: number;
    newRelation: NewRelationDto;
}
export {};
