import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsString()       //check string
  @MinLength(3)     //length>3
  @MaxLength(200)   //length<200
  @IsOptional()     //title optional
  title?: string;

  @IsString()       //check string
  @MinLength(10)    //length>3
  @IsOptional()     //content optional
  content?: string;
}
