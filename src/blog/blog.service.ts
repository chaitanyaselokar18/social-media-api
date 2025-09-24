import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {

constructor (private prisma: PrismaService){}

async createBlog(user: { id: number; role: Role }, dto: CreateBlogDto) {

    return this.prisma.blog.create({
        data: {
            title: dto.title,
            description: dto.description,
            authorId: user.id,
        },
        include: { author:{ select: {id:true,email:true,role:true}}},
    });
    
}

// Get All Blogs (pagenation)
  async getAllBlogs(page: number = 1, limit: number = 10) {
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

// Get Blog by ID
  async getBlogById(blogId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
      include: { author: { select: { id: true, email: true, role: true } } },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  // Update Blog (owner or SUPERADMIN)
    async updateBlog(blogId: number, dto: UpdateBlogDto, user: { id: number; role: Role }) {
      const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
      if (!blog) throw new NotFoundException('Blog not found');
  
      if (blog.authorId !== user.id && user.role !== Role.SUPERADMIN) {
        throw new ForbiddenException('You cannot update this blog');
      }
  
      return this.prisma.blog.update({
        where: { id: blogId },
        data: {
          title: dto.title ?? blog.title,
          description: dto.description ?? blog.description,
        },
        include: { author: { select: { id: true, email: true, role: true } } },
      });
    }

    // Delete Blog (owner or SUPERADMIN)
  async deleteBlog(postId: number, user: { id: number; role: Role }) {
    const blog = await this.prisma.blog.findUnique({ where: { id: postId } });
    if (!blog) throw new NotFoundException('Blog not found');

    if (blog.authorId !== user.id && user.role !== Role.SUPERADMIN) {
      throw new ForbiddenException('You cannot delete this blog');
    }

    await this.prisma.blog.delete({ where: { id: postId } });
    return blog;
    ;
  }
}
