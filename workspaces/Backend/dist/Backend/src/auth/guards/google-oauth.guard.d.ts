declare const GoogleOauthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GoogleOauthGuard extends GoogleOauthGuard_base {
    constructor();
    handleRequest(err: any, user: any, info: any, context: any, status: any): any;
}
export {};
