// src/users/entities/user.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { BlogEntity } from 'src/blog/entities/blog.entity';
import { PostEntity } from 'src/posts/entities/post.entity';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => BlogEntity, isArray: true, required: false })
  blog: BlogEntity[] | null;

  @ApiProperty({ type: () => PostEntity, isArray: true, required: false })
  post: PostEntity[] | null;
}
