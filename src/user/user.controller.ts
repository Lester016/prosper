import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseFilters,
} from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { HttpExceptionFilter } from '../exception.filter';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseFilters(HttpExceptionFilter)
@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
