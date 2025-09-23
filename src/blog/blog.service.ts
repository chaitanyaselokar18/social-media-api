import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {

constructor (private prisma: PrismaService){}

async createPost(user: { id: number; role: Role }, dto: CreateBlogDto) {

    return this.prisma.blog.create({
        data: {
            title: dto.title,
            description: dto.description,
            authorId: user.id,
        },
        include: { author:{ select: {id:true,email:true,role:true}}},
    });
    


}
}
