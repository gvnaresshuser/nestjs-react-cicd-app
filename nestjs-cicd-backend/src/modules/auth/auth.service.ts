import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private config: ConfigService) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  generateTokens(user: any) {
    console.log('Generating tokens for user:', user); // ✅ LOG USER INFO
    const payload = {
      id: user.id, // ✅ ADD THIS - to track last activity
      email: user.email,
      role: user.role,
    };

    const secret = this.config.get<string>('jwt.secret')!;

    //READING FROM configuration.ts file
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: this.config.get<string>('jwt.accessExpires') as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, secret, {
      expiresIn: this.config.get<string>('jwt.refreshExpires') as jwt.SignOptions['expiresIn'],
    });

    console.log('jwt.accessExpires::' + this.config.get<string>('jwt.accessExpires'));
    console.log('jwt.refreshExpires::' + this.config.get<string>('jwt.refreshExpires'));

    //READING FROM .env file
    /*  const accessToken = jwt.sign(payload, secret, {
            expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES') as jwt.SignOptions['expiresIn'],
        });

        const refreshToken = jwt.sign(payload, secret, {
            expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES') as jwt.SignOptions['expiresIn'],
        });

        console.log("JWT_ACCESS_EXPIRES::" + this.config.get<string>('JWT_ACCESS_EXPIRES'));
        console.log("JWT_REFRESH_EXPIRES::" + this.config.get<string>('JWT_REFRESH_EXPIRES')); */

    return { accessToken, refreshToken };
  }

  // ✅ NEW METHOD
  verifyRefreshToken(token: string) {
    const secret = this.config.get<string>('jwt.secret')!;
    return jwt.verify(token, secret);
  }
}
