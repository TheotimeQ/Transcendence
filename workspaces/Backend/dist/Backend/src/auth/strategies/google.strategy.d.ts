import { Strategy } from 'passport-google-oauth20';
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    constructor();
    validate(_accessToken: string, _refreshToken: string, profile: any): Promise<any>;
}
export {};
