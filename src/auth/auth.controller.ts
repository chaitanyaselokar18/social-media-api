import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //User signUp
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }
  
  //User logIn
  @Post('login')
  async login(@Body() body: CreateUserDto) {
    return this.authService.login(body.email, body.password);
  }
}
