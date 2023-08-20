declare const JwtRefreshStrategy_base: new (...args: any[]) => any;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor();
    private static extractJWT;
    validate(payload: any): Promise<{
        id: any;
        login: any;
    }>;
}
export {};
