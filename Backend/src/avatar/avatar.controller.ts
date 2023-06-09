/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Put,
  Request,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
import { UsersService } from 'src/users/users.service';

@Controller('avatar')
export class AvatarController {
  constructor(
    private readonly avatarService: AvatarService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async getAvatar(@Request() req) {
    const user = await this.userService.getUserAvatar(req.user.id);

    if (!user)
      return {
        exists: false,
      };

    return user.avatar;
  }

  @Get(':name/:isChannel')
  async getAvatarByName(
    @Param('name') name: string,
    @Param('isChannel', ParseBoolPipe) isChannel: boolean,
  ) {
    const avatar = await this.avatarService.getAvatarByName(
      name,
      isChannel,
    );

    if (!avatar) throw new NotFoundException('avatar not found');

    return avatar;
  }

  @Put()
  async updateUserAvatar(@Request() req, @Body() updateUserAvatarDto: UpdateUserAvatarDto) {
    // [!] TODO : custom validationPipe OU enumeDecorator contenant le tableau des couleurs authorisee
    // [!] ne pas oublier que les couleurs peuvent avoir des min et/ou majuscules
    console.log('PUT avatar received');
    console.log('updateAvatarDto :', updateUserAvatarDto);

    return this.avatarService.editUserAvatarColors(req, updateUserAvatarDto);
  }
}
