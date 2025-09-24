
import { ApiProperty } from '@nestjs/swagger';
import { Blog  } from '@prisma/client';

export class BlogEntity implements Blog{
  constructor(partial: Partial<BlogEntity>) {
    Object.assign(this, partial);
  }
  
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  updatedAt: Date;

   
}
