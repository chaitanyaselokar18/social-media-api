import { Controller, Get, Delete, Patch, Param, ParseIntPipe, Body, UseGuards, Query, ParseArrayPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiPropertyOptional, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { isArray } from 'class-validator';
import { USER_INC } from 'src/common/enum/user-include-enum';
import { PostEntity } from 'src/posts/entities/post.entity';

@ApiTags('Users')//optional
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Superadmin: Get all users
  @Get()
  @ApiQuery({name:'page',required:false,type:Number,description:"Enter page number",example:1})
  @ApiQuery({name:'limit',required:false,type:Number,description:"Enter page limit",example:5})
  @ApiQuery({name:'includes',required:false,type:String,description:"Enter page names (posts or blog)",example:"posts",enum:USER_INC})
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({type:()=>UserEntity, isArray:true})
  // @ApiResponse({ status: 200, description: 'List of users returned successfully.' })
  @Roles(Role.SUPERADMIN)
  async getAllUsers(
  @Query('page') page = 1,
  @Query('limit') limit = 5,
  @Query('includes',new ParseArrayPipe({optional:true})) includeParam?: USER_INC[],
  ) {
  const { data, total, totalPages } = await this.usersService.getAllUsers(
      +page,
      +limit,
      includeParam,
    );
  return {
    message: 'Users retrieved successfully',
    data:data.map((data) => new UserEntity(data)),
    pagination: {
      page: +page,
      limit: +limit,
      total,
      totalPages,
    },
  };
  }

  // Superadmin: Delete any user
  @Delete(':id')
  @ApiOperation({ summary: 'SUPERADMIN only delete user by id' })
  @ApiOkResponse({type:()=>UserEntity})
  @Roles(Role.SUPERADMIN)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const deletedUser= new UserEntity( await this.usersService.deleteUser(id));
    return {
      message: `User with ID ${id} deleted successfully`,
      data:deletedUser,
      statusCode: 200,
    };
  }

  // Superadmin: Promote/Demote user role
  @Patch(':id/role')
  @ApiOperation({ summary: 'SUPERADMIN only change role' })
  @Roles(Role.SUPERADMIN)
  @ApiOkResponse({type:()=> UserEntity})
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() user
  ) {
    const updatedUser =new UserEntity( await this.usersService.updateUserRole(id, dto.role));
    return {
      message:
        dto.role === Role.SUPERADMIN
          ? 'User promoted to SUPERADMIN'
          : 'User demoted to USER',
      data: updatedUser,
      statusCode: 200,
    };
  }
}
