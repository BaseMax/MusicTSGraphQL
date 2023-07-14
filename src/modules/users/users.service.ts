import { Service } from 'typedi';
import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { Role } from './user.model';
import { NotFoundException } from '../../errors/notfound.exception';

@Service()
export class UsersService {
  constructor(private prisma: PrismaClient) {}
  getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async getUserByIdOrFail(id: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('user');
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
