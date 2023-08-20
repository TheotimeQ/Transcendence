import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ChannelService } from 'src/channels/channel.service';
export declare class ChannelAuthGuard implements CanActivate {
    private readonly reflector;
    private readonly channelService;
    constructor(reflector: Reflector, channelService: ChannelService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
