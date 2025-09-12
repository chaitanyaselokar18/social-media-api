import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //get All User (pagenation)
  async getAllUsers(page: number = 1, limit: number = 10) {
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  const [data, total] = await this.prisma.$transaction([
    this.prisma.user.findMany({
      skip,
      take: limit,
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.user.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { data, total, totalPages };
}

  //delete User (by only SUPERADMIN)
  async deleteUser(id: number) {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException(`User with ID ${id} not found.`);

  await this.prisma.user.delete({ where: { id } });

  return user;
}

  // Update user role
  async updateUserRole(id: number, role: string) {
    // Validate role
    if (role !== Role.USER && role !== Role.SUPERADMIN) {
      throw new BadRequestException('Invalid role. Allowed values: USER or SUPERADMIN');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    // Update role
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    return updatedUser;
  
  }
}

