import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description:"Title cannot exceed 200 characters",
    example:"This my first post"
  })
  @IsString()                                         //check String
  @IsNotEmpty({ message: 'Title is required' })       //check title
  @MinLength(3)                                       //length>3
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })    //length<200
  title: string;

  @ApiProperty({
    description: "Content is required",
    example: "Today i am very happy"
  })
  @IsString()                                         //check String
  @IsNotEmpty({ message: 'Content is required' })     //check content
  @MinLength(10)                                      //length>10
  content: string;
}
