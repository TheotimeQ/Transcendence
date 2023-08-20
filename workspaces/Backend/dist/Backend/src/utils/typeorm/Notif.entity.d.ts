import { NotifMessages } from "./NotifMessages.entity";
export declare class Notif {
    id: number;
    redPongies: number[];
    redChannels: number[];
    notifMessages: NotifMessages[];
    nullChecks(): Promise<void>;
}
