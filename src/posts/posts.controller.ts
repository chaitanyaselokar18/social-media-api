import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe, UseGuards,
  ValidationPipe, UsePipes, HttpStatus, BadRequestException, Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard) // JWT + Role guard applied globally
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Create Post (any authenticated user)
  @Post()
  @Roles(Role.USER, Role.SUPERADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createPost(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: { id: number; role: Role }
  ) {
    
    const post = await this.postsService.createPost(user, dto);
    return {
      message: 'Post created successfully',
      data: post,
      statusCode: HttpStatus.CREATED,
    };
  }

  // Get all posts (authentication required)
  @Get()
  async getAllPosts(
  @Query('page') page = 1,
  @Query('limit') limit = 5,
) {
  const { data, total, totalPages } = await this.postsService.getAllPosts(+page, +limit);

  return {
    message: 'Posts retrieved successfully',
    data,
    pagination: {
      page: +page,
      limit: +limit,
      total,
      totalPages,
    },
  };
  }

  // Get post by ID (authentication required)
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.getPostById(id);
    return {
      message: 'Post retrieved successfully',
      data: post,
      statusCode: HttpStatus.OK,
    };
  }

  // Update post (only owner or superadmin)
  @Put(':id')
  @Roles(Role.USER, Role.SUPERADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: { id: number; role: Role }
  ) {
    

    const updatedPost = await this.postsService.updatePost(id, dto, user);
    return {
      message: 'Post updated successfully',
      data: updatedPost,
      statusCode: HttpStatus.OK,
    };
  }

  // Delete post (only owner or superadmin)
  @Delete(':id')
  @Roles(Role.USER, Role.SUPERADMIN)
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role: Role }
  ) {
    
    const deletedPost = await this.postsService.deletePost(id, user);
    return {
      message: 'Post deleted successfully',
      data: deletedPost,
      statusCode: HttpStatus.OK,
    };
  }
}
