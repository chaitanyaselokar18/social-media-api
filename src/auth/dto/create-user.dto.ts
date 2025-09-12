import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()  //check email
  email: string;

  @IsString()       //check string
  @MinLength(6)     //length>=6
  password: string;
}
