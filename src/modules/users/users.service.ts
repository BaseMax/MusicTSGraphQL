import { inject, injectable } from "tsyringe";
import { User } from "@prisma/client";
import { PrismaService } from "../../utils/prisma.service";
import { Role } from "./user.model";
import { NotFoundException } from "../../errors/notfound.exception";

@injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    getUserById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async getUserByIdOrFail(id: string): Promise<User> {
        const user = await this.getUserById(id);
        if (!user) {
            throw new NotFoundException("user");
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
