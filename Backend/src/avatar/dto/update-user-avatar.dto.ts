import { IsEnum, IsHexColor, IsNotEmpty } from 'class-validator';
import { PongColors } from 'src/utils/enums/PongColors.enum';

export class UpdateUserAvatarDto {
  @IsNotEmpty()
  @IsHexColor()
  @IsEnum(PongColors)
  borderColor: string;

  @IsNotEmpty()
  @IsHexColor()
  @IsEnum(PongColors)
  backgroundColor: string;
}
