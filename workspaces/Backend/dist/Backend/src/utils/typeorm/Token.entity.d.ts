import { User } from "./User.entity";
export declare class Token {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    value: string;
    NbOfRefreshes: number;
    user: User;
}
