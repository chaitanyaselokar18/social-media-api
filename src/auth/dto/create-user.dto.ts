import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description:"user email",
    example:"user@example.com"
  })
  @IsEmail()  //check email
  email: string;

  @ApiProperty({
    description:"user password"
  })
  @IsString()       //check string
  @MinLength(6)     //length>=6
  password: string;
}
