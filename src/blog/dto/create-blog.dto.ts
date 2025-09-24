import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description:"Title cannot exceed 200 characters",
    example: "My first post"
  })
  @IsString()                                         //check String
  @IsNotEmpty({ message: 'Title is required' })       //check title
  @MinLength(3)                                       //length>3
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })    //length<200
  title: string;

  @ApiProperty({
    description:"description is required",
    example: "Today i am going to goa"
  })
  @IsString()                                         //check String
  @IsNotEmpty({ message: 'description is required' })     //check description
  @MinLength(10)                                      //length>10
  description: string;
}
