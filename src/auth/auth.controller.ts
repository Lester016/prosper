import { Body, Controller, Post, Req, Res, UseFilters } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from '../exception.filter';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Public()
@UseFilters(HttpExceptionFilter)
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(req.ip);
    const { accessToken, refreshToken } = await this.authService.register(
      registerDto,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Send the cookie over HTTPS only
      sameSite: 'strict', // Strictly limit to same site requests
      // path: '/auth/refresh', // Limit the cookie path to the refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry set to match the token expiry
    });

    return res.status(200).json({ accessToken });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      loginDto,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  }
}
