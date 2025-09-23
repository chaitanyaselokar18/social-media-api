// // src/users/entities/user.entity.ts
// //import { ApiProperty } from '@nestjs/swagger';
// import { Role, User } from '@prisma/client';
// import { Exclude } from 'class-transformer';

// export class UserEntity implements User {
//   @ApiProperty()
//   id: number;

//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   updatedAt: Date;
  
//   @ApiProperty()
//   email: string;

//   @ApiProperty()
//   role: Role;

//   @Exclude
//   password: string;
// }
