import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Role, User } from "../users/user.model";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { AuthPayload } from "./dto/auth-payload.model";
import { LoginUserInput } from "./dto/login.input";
import { RegisterUserInput } from "./dto/register.input";
// import { UserAuthPayload } from './dto/user.data';
// import { AuthenticatedDec } from './authenticated-user.decorator';
import { injectable } from "tsyringe";
import { UserAuthPayload } from "./dto/user.data";
import { CurrentUser } from "./dto/current-user.decorator";

@injectable()
@Resolver()
export class AuthResolver {
  constructor(
    private service: AuthService,
    private usersService: UsersService
  ) { }

  @Mutation(() => AuthPayload)
  async register(
    @Ctx() ctx: any,
    @Arg("input", () => RegisterUserInput)
    input: RegisterUserInput
  ) {
    const { token, user } = await this.service.register(input);
    ctx.user = user;
    return { token, user };
  }

  @Mutation(() => AuthPayload)
  async login(
    @Ctx() ctx: any,
    @Arg("input", () => LoginUserInput)
    input: LoginUserInput
  ) {
    const { token, user } = await this.service.login(input);
    ctx.user = user;
    return { token, user };
  }
  @Authorized()
  @Query(() => User)
  async user(@CurrentUser() user: UserAuthPayload) {
    return this.usersService.getUserById(user.id);
  }
  //
  // @Authorized([Role.superadmin])
  // @Mutation(() => User)
  // async changeRole(
  //   @Arg('userId') userId: string,
  //   @Arg('role', () => Role) role: Role,
  // ) {
  //   return this.usersService.changeRole(userId, role);
  // }
}
