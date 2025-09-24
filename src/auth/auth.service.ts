import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.Entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  //signUp
  async signup(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already exists.'); //check new user

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const hashed = await bcrypt.hash(password, 10);

    const user = new UserEntity(
      await this.prisma.user.create({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { email, password: hashed },
      }),
    );

    return { message: 'User created successfully.', user };
  }

  //logIn
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials.'); //check Email

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials.'); //check Password

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
