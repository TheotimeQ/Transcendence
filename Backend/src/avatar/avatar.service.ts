/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channels/channel.service';
import { UsersService } from 'src/users/users.service';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { Repository } from 'typeorm';
import { AvatarDto } from './dto/Avatar.dto';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,

    private readonly usersService: UsersService,
    private readonly channelService: ChannelService,
  ) {}

  async createAvatar(avatarDto: AvatarDto) {
    return await this.avatarRepository.save(avatarDto);
  }

  public async getAvatarById(id: number, isChannel: boolean) {
    try {
      if (!isChannel) {
        const avatar = (await this.usersService.getUserAvatar(id)).avatar;

        if (!avatar) throw new NotFoundException('avatar not found');

        return avatar;
      } else {
        const avatar = (await this.channelService.getChannelAvatar(id)).avatar;

        if (!avatar) throw new NotFoundException('avatar not found');

        return avatar;
      }
    } catch (error) {
      return undefined;
    }
  }

  async editUserAvatarColors(
    req: any,
    updateUserAvatarDto: UpdateUserAvatarDto,
  ) {
    const rep:ReturnData = {
      success: false,
      message: '',
    };

    try {
      const avatar: Avatar = (
        await this.usersService.getUserAvatar(req.user.id)
      ).avatar;

      if (!avatar) {
        const defaultAvatar = this.createDefaultAvatar();
        rep.message = 'Avatar not found - default avatar created instead';

        if (!defaultAvatar)
          rep.message = 'Avatar not found, then failed default avatar creation';
      } else {
        avatar.borderColor = updateUserAvatarDto.borderColor;
        avatar.backgroundColor = updateUserAvatarDto.backgroundColor;
        await this.avatarRepository.update(avatar.id, avatar);

        this.log(
          `user : ${req.user.login} - border color updated: ${updateUserAvatarDto.borderColor} - background color updated: ${updateUserAvatarDto.backgroundColor}`,
        );
        rep.success = true;
        rep.message = 'Avatar colors successfully updated';
      }
    } catch (error) {
      rep.message = error.message;
	  rep.error
    }
    return rep;
  }

  async editChannelAvatarColors(
    req: any,
    updateUserAvatarDto: UpdateUserAvatarDto,
  ) {
	const rep:ReturnData = {
		success: false,
		message: '',
	  };
	  try {

    const check = await this.channelService.checkChanOpPrivilege(req.user.id, updateUserAvatarDto.isChannel);

    if (!check.isChanOp)
      throw new Error(rep.error);

		const avatar:Avatar = (await (this.channelService.getChannelAvatar(updateUserAvatarDto.isChannel))).avatar;

		if (!avatar)
			throw new Error(`error while fetching avatar of channel(id: ${updateUserAvatarDto.isChannel})`);
		avatar.borderColor = updateUserAvatarDto.borderColor;
		avatar.backgroundColor = updateUserAvatarDto.backgroundColor;
		await this.avatarRepository.update(avatar.id, avatar);

		this.log(
			`channel(id: ${updateUserAvatarDto.isChannel}) avatar updated by user : ${req.user.login} - border color updated: ${updateUserAvatarDto.borderColor} - background color updated: ${updateUserAvatarDto.backgroundColor}`,
		  );

		rep.success = true;
		rep.message = `channel(id: ${updateUserAvatarDto.isChannel}) avatar updated by user : ${req.user.login} - border color updated: ${updateUserAvatarDto.borderColor} - background color updated: ${updateUserAvatarDto.backgroundColor}`;

	} catch (error) {
		rep.message = error.message;
		rep.error = error;
	}

	return rep;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~ tools ~~~~~~~~~~~~~~~~~~~~~~ */

  private async createDefaultAvatar() {
    const avatar: AvatarDto = {
      image: '',
      text: '',
      variant: 'circular',
      borderColor: '#22d3ee',
      backgroundColor: '#22d3ee',
      empty: true,
      decrypt: false,
    };

    return await this.avatarRepository.save(avatar);
  }

  // [!][?] virer ce log pour version build ?
  private log(message?: any) {
    const cyan = '\x1b[36m';
    const stop = '\x1b[0m';

    process.stdout.write(cyan + '[Avatar service]  ' + stop);
    console.log(message);
  }
}
