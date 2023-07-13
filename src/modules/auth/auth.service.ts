import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterUserInput } from './dto/register.input';
import * as argon2 from 'argon2';
import { Role, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(input: RegisterUserInput) {
    const userExists = await this.usersService.getUserByEmail(input.email);
    if (userExists) {
      throw new BadRequestException('user exists');
    }

    const hashedPassword = await argon2.hash(input.password);
    const user = await this.prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
        role: Role.user,
      },
    });

    const token = this.getToken(user);
    return {
      user,
      token,
    };
  }

  async login(input: LoginUserInput) {
    const user = await this.usersService.getUserByEmail(input.email);
    if (!user || !(await argon2.verify(user.password, input.password))) {
      throw new BadRequestException('invalid email or password');
    }
    return {
      user,
      token: this.getToken(user),
    };
  }
  getToken(user: User) {
    const token = this.jwt.sign({
      id: user.id,
      role: user.role,
    });
    return token;
  }
}
