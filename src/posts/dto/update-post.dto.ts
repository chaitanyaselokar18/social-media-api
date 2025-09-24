import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description:"Title cannot exceed 200 characters",
    example: "I am updating my post title"
  })
  @IsString()       //check string
  @MinLength(3)     //length>3
  @MaxLength(200)   //length<200
  @IsOptional()     //title optional
  title?: string;

  @ApiProperty({
    description:"content is optional",
    example: "My post content is updated"
  })
  @IsString()       //check string
  @MinLength(10)    //length>3
  @IsOptional()     //content optional
  content?: string;
}
