import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()                                         //check String
  @IsNotEmpty({ message: 'Title is required' })       //check title
  @MinLength(3)                                       //length>3
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })    //length<200
  title: string;

  @IsString()                                         //check String
  @IsNotEmpty({ message: 'description is required' })     //check description
  @MinLength(10)                                      //length>10
  description: string;
}
