import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //User signUp
  @Post('signup')
  @ApiOkResponse({type:()=>UserEntity})
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }
  
  //User logIn
  @Post('login')
  @ApiOkResponse({type:()=>UserEntity})
  async login(@Body() body: CreateUserDto) {
    return this.authService.login(body.email, body.password);
  }
}
