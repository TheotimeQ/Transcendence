export declare class CreateUserDto {
    login?: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    image?: string;
    passwordHashed?: string;
    expirationCode?: number;
    verifyCode?: string;
    verified: boolean;
    provider: string;
    motto?: string;
    story?: string;
}
