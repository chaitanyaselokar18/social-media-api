import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // Create Post
  async createPost(user: { id: number; role: Role }, dto: CreatePostDto) {

    const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) throw new NotFoundException('User not found');

    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId: user.id,
      },
      include: { author: { select: { id: true, email: true, role: true } } },
    });
  }

  // Get All Posts (pagenation)
  async getAllPosts(page: number = 1, limit: number = 10) {
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  const [data, total] = await this.prisma.$transaction([
    this.prisma.post.findMany({
      skip,
      take: limit,
      include: { author: { select: { id: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.post.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { data, total, totalPages };
}

  // Get Post by ID
  async getPostById(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { author: { select: { id: true, email: true, role: true } } },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  // Update Post (owner or SUPERADMIN)
  async updatePost(postId: number, dto: UpdatePostDto, user: { id: number; role: Role }) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    if (post.authorId !== user.id && user.role !== Role.SUPERADMIN) {
      throw new ForbiddenException('You cannot update this post');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title ?? post.title,
        content: dto.content ?? post.content,
      },
      include: { author: { select: { id: true, email: true, role: true } } },
    });
  }

  // Delete Post (owner or SUPERADMIN)
  async deletePost(postId: number, user: { id: number; role: Role }) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    if (post.authorId !== user.id && user.role !== Role.SUPERADMIN) {
      throw new ForbiddenException('You cannot delete this post');
    }

    await this.prisma.post.delete({ where: { id: postId } });
    return post;
  }
}
