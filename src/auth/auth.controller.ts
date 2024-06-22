import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from '../exception.filter';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

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
      path: '/auth/refresh', // Limit the cookie path to the refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry set to match the token expiry
    });

    return res.status(200).json({ accessToken });
  }

  @Post('login')
  login(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }
}
