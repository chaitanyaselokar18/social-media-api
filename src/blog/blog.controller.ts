import { Body, Controller, HttpStatus, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';


@Controller('blog')
@UseGuards(JwtAuthGuard,RolesGuard)
export class BlogController {
    constructor (private readonly blogService: BlogService){}

    //create blog
    @Post()
    @Roles(Role.USER,Role.SUPERADMIN)
    @UsePipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}))
    async createPost(
        @Body() dto: CreateBlogDto,
        @CurrentUser() user: {id:number,role:Role}
    ){
        const post = await this.blogService.createPost(user, dto);
        return {
          message: 'Post created successfully',
          data: post,
          statusCode: HttpStatus.CREATED,
        };
    }



    }
