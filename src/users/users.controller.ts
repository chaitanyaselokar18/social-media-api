import { Controller, Get, Delete, Patch, Param, ParseIntPipe, Body, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Superadmin: Get all users
  @Get()
  @Roles(Role.SUPERADMIN)
  async getAllUsers(
  @Query('page') page = 1,
  @Query('limit') limit = 5,
  @Query('include') includeParam?: string|undefined
) {
  const { data, total, totalPages } = await this.usersService.getAllUsers(+page, +limit,includeParam);

  return {
    message: 'Users retrieved successfully',
    data,
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
  @Roles(Role.SUPERADMIN)
  async deleteUser(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    const deletedUser = await this.usersService.deleteUser(id);
    return {
      message: `User with ID ${id} deleted successfully`,
      data: deletedUser,
      statusCode: 200,
    };
  }

  // Superadmin: Promote/Demote user role
  @Patch(':id/role')
  @Roles(Role.SUPERADMIN)
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() user
  ) {
    const updatedUser = await this.usersService.updateUserRole(id, dto.role);
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
