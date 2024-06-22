import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import exp from 'constants';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

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

    await this.userRepository.save(user);

    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign({
      email: user.email,
      id: user.id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
