import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { createUserDto } from 'src/users/dto/CreateUser.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_ID_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user: createUserDto = {
      provider: 'google',
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      image: photos[0].value,
      verified: true,
      logged: true,
    };

    done(null, user);
  }
}
