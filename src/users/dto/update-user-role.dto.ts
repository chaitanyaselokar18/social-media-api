import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({
    description:"Role must be USER or SUPERADMIN",
    example: "USER or SUPERADMIN"
  })
  @IsEnum(Role, { message: 'Role must be USER or SUPERADMIN' })
  role: Role;
}
