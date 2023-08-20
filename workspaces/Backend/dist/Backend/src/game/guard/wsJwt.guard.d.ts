import { CanActivate } from "@nestjs/common";
import { Observable } from "rxjs";
export declare class WsJwtGuard implements CanActivate {
    canActivate(context: any): boolean | any | Promise<boolean | any> | Observable<boolean | any>;
}
