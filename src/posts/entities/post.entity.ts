
import { ApiProperty } from '@nestjs/swagger';
import { Post  } from '@prisma/client';

export class PostEntity implements Post{
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }
  
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  updatedAt: Date;

   
}
