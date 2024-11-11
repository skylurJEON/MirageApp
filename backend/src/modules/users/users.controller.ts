import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.usersService.create(signUpDto.email, signUpDto.password, signUpDto.username);
  }
}