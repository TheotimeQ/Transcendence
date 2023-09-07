/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChannelService } from '@/channels/service/channel.service';

type Required = {
  channelId: number;
};

@Injectable()
export class ChannelAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly channelService: ChannelService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const wsContext = context.switchToWs();
    const message: Required = wsContext.getData();

    const channelId = message.channelId;
    const userId = req.user.id;

    const isAllowed = await this.channelService.isUserInChannel(
      userId,
      channelId,
    );

    if (!isAllowed) this.log(`user[${userId}] not into channel[${channelId}]`);

    return isAllowed;
  }

  // tools

  private log(message?: any) {
    const green = '\x1b[36m';
    const stop = '\x1b[0m';

    if (!process.env || !process.env.ENVIRONNEMENT || process.env.ENVIRONNEMENT !== "dev") return;

    process.stdout.write(green + '[ChannelAuthGuard]  ' + stop);
    console.log(message);
  }
}
