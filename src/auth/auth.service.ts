import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async register(registerDto: RegisterDto) {
    const userExist = await this.userRepository.findOneBy({
      email: registerDto.email,
    });

    if (userExist) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    registerDto.password = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create(registerDto);

    const { password, ...result } = await this.userRepository.save(user);

    const accessToken = this.jwtService.sign(
      {
        user: result,
      },
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign({
      user: result,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async googleLogin(code: string) {
    // Use the authorized code to get access token google.
    const params = {
      code,
      client_id: this.configService.get<string>('google.clientId'),
      client_secret: this.configService.get<string>('google.clientSecret'),
      redirect_uri: this.configService.get<string>('google.redirectUri'),
      grant_type: 'authorization_code',
    };

    try {
      // Get the access token using the code passed by the client.
      const response = await lastValueFrom(
        this.httpService.post('https://oauth2.googleapis.com/token', params),
      );

      // Use the access token to get user info from google.
      const userResponse = await lastValueFrom(
        this.httpService.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        }),
      );

      // We can register the user info in our database and authenticate them.
      // Or we can just return the access token provided by google and let the client handle the rest.
      const accessToken = this.jwtService.sign(
        {
          user: userResponse.data,
        },
        {
          expiresIn: '15m',
        },
      );

      const refreshToken = this.jwtService.sign({
        user: userResponse.data,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.response.data.description,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const { password, ...payload } = user;

    const accessToken = this.jwtService.sign(
      {
        user: payload,
      },
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign({
      user: payload,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
