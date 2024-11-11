import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';  
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
      ) {}
    
      async signUp(email: string, password: string, username: string) {
        return this.usersService.create(email, password, username);
      }
    
      async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
          throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
        }
    
        console.log('User:', user);
        console.log('Password:', password);
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
        }
    
        const payload = { email: user.email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
          username: user.username
        };
      }
}