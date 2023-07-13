import { createInterface } from "readline/promises"

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';
import { Role } from "./modules/users/user.model";
import { AuthService } from "./modules/auth/auth.service";

async function bootstrap() {
  const rl = createInterface(process.stdin, process.stdout)
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const authService = app.get(AuthService)
  const usersService = app.get(UsersService)

  const { user: { id } } = await authService.register({
    email: await rl.question('email address : '),
    name: await rl.question('name :'),
    password: await rl.question("password :")
  });
  await usersService.changeRole(id, Role.superadmin)
  console.log("end")
  process.exit(0)
}
bootstrap();
