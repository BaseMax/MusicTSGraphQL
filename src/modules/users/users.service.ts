import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from './user.model';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async getUserByIdOrFail(id: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async changeRole(id: string, role: Role) {
    await this.getUserByIdOrFail(id);
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
