import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
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
