import "reflect-metadata";
import { createInterface } from "readline/promises";

import { UsersService } from "./modules/users/users.service";
import { Role } from "./modules/users/user.model";
import { AuthService } from "./modules/auth/auth.service";
import { container } from "./container";
async function bootstrap() {
    const rl = createInterface(process.stdin, process.stdout);

    const authService = container.resolve(AuthService);
    const usersService = container.resolve(UsersService);

    const {
        user: { id },
    } = await authService.register({
        email: await rl.question("email address : "),
        name: await rl.question("name :"),
        password: await rl.question("password :"),
    });
    await usersService.changeRole(id, Role.superadmin);
    console.log("end");
    process.exit(0);
}
bootstrap();
