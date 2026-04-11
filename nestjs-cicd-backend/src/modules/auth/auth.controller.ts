import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
//import type { Response } from 'express'; // ✅ FIX
import { Req, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { Inject, forwardRef } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  /*     @Post('login')
        async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
            const tokens = this.authService.generateTokens(body);
    
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });
    
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: false,
            });
    
            return { message: 'Login successful', tokens };
        } */
  /*
    This method handles:
     User authentication (email + password)
     Token generation (JWT)
     Setting cookies
     Updating last activity
     -------------------------
     With passthrough: true
     You can modify the response (set cookies, headers)
     But still return data normally
     What passthrough Actually Means
     👉 It tells NestJS:
     “Let me access res, but YOU (NestJS) still handle the final response.”
     Cookies require direct res access
     NestJS sends this JSON automatically
    */
  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    // ✅ STEP 1: Fetch user from DB
    const user = await this.usersService.findByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.password) {
      throw new UnauthorizedException('Invalid user data');
    }

    // ✅ STEP 2: Validate password
    const isMatch = await this.authService.comparePassword(body.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ✅ ADD THIS
    await this.usersService.update(user.id, {
      lastActivity: new Date(),
    });

    // ✅ STEP 3: Generate tokens using DB user (HAS ID)
    const tokens = this.authService.generateTokens(user);

    // ✅ STEP 4: Set cookies
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
    });

    return {
      message: 'Login successful',
      tokens,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/', // ✅ MUST MATCH
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/', // ✅ MUST MATCH
    });

    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @SkipThrottle() //This ensures:Refresh NEVER gets blocked
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    try {
      const user = this.authService.verifyRefreshToken(refreshToken);

      const tokens = this.authService.generateTokens(user); //NEW SET OF TOKENS

      // ✅ set new access token
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      });

      // OPTIONAL: rotate refresh token
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        path: '/',
      });

      return { message: 'Token refreshed' };
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
