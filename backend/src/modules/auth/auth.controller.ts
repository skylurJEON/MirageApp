import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from '../users/dto/signup.dto';
import { LoginDto } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
      console.log('SignUpDto:', signUpDto); // DTO 내용 로그 출력
      return this.authService.signUp(
        signUpDto.email,
        signUpDto.password,
        signUpDto.username,
      );
    }
  
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
      console.log('LoginDto:', loginDto); // DTO 내용 로그 출력
      return this.authService.login(loginDto.email, loginDto.password);
    }
}