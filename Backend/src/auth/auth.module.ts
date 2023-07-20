import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MailModule } from 'src/mail/mail.module';
import { CryptoService } from 'src/utils/crypto/crypto';
import { GoogleStrategy } from './strategies/google.strategy';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { AvatarService } from 'src/avatar/avatar.service';
import { LocalStrategy } from './strategies/local.strategy';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { RefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { Token } from 'src/utils/typeorm/Token.entity';
import { JwtNoExpirationTimeStrategy } from './strategies/jwtNoExpirationTime.strategy';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { ChannelService } from 'src/channels/channel.service';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([
      User,
      Avatar,
      Channel,
      Token,
      UserChannelRelation,
    ]),
    JwtModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AvatarService,
    ChannelService,
    JwtStrategy,
    RefreshTokenStrategy,
    JwtNoExpirationTimeStrategy,
    GoogleStrategy,
    LocalStrategy,
    CryptoService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
