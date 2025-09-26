import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogEntity } from './entities/blog.entity';


@ApiBearerAuth('access-token')
@Controller('blog')
@UseGuards(JwtAuthGuard,RolesGuard)
export class BlogController {
    constructor (private readonly blogService: BlogService){}

    //create blog
    @Post()
    @ApiOperation({ summary: 'create blog' })
    @ApiOkResponse({type:()=>BlogEntity})
    @Roles(Role.USER,Role.SUPERADMIN)
    @UsePipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}))
    async createPost(
        @Body() dto: CreateBlogDto,
        @CurrentUser() user: {id:number,role:Role}
    ){
        const blog = await this.blogService.createBlog(user, dto);
        return {
          message: 'Blog created successfully',
          data: blog,
          statusCode: HttpStatus.CREATED,
        };
    }

    // Get all blogs (authentication required)
      @Get()
      @ApiQuery({name:'page',required:false,type:Number,description:"Enter page number",example:"1"})  
      @ApiOperation({ summary: 'get all blog' })
      @ApiOkResponse({type:()=>BlogEntity, isArray:true})
      async getAllBlogs(
      @Query('page') page = 1,
      @Query('limit') limit = 5,
    ) {
      const { data, total, totalPages } = await this.blogService.getAllBlogs(+page, +limit);
    
      return {
        message: 'Blogs retrieved successfully',
        data,
        pagination: {
          page: +page,
          limit: +limit,
          total,
          totalPages,
        },
      };
      }

      // Get blog by ID (authentication required)
        @Get(':id')
        @ApiOperation({ summary: 'get blog by id' })
        @ApiOkResponse({type:()=>BlogEntity})
        async getBlogById(@Param('id', ParseIntPipe) id: number) {
          const blog = await this.blogService.getBlogById(id);
          return {
            message: 'Blog retrieved successfully',
            data: blog,
            statusCode: HttpStatus.OK,
          };
        }
      
        // Update blog (only owner or superadmin)
          @Put(':id')
          @ApiOperation({ summary: 'SUPERADMIN or owner only update blog' })
          @ApiOkResponse({type:()=>BlogEntity})
          @Roles(Role.USER, Role.SUPERADMIN)
          @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
          async updateBlog(
            @Param('id', ParseIntPipe) id: number,
            @Body() dto: UpdateBlogDto,
            @CurrentUser() user: { id: number; role: Role }
          ) {
            
        
            const updatedBlog = await this.blogService.updateBlog(id, dto, user);
            return {
              message: 'Blog updated successfully',
              data: updatedBlog,
              statusCode: HttpStatus.OK,
            };
          }

          // Delete blog (only owner or superadmin)
            @Delete(':id')
            @ApiOperation({ summary: 'SUPERADMIN or owner only delete blog' })
            @ApiOkResponse({type:()=>BlogEntity})
            @Roles(Role.USER, Role.SUPERADMIN)
            async deleteBlog(
              @Param('id', ParseIntPipe) id: number,
              @CurrentUser() user: { id: number; role: Role }
            ) {
              
              const deletedBlog = await this.blogService.deleteBlog(id, user);
              return {
                message: 'Blog deleted successfully',
                data: deletedBlog,
                statusCode: HttpStatus.OK,
              };
            }
    }
