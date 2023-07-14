import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Role, User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload.model';
import { LoginUserInput } from './dto/login.input';
import { RegisterUserInput } from './dto/register.input';
import { UserAuthPayload } from './dto/user.data';
import { AuthenticatedDec } from './authenticated-user.decorator';
import { MinRole } from './min-role.decorator';
import { Private } from './optional.decorator';
import { Service } from 'typedi';


@Service()
@Resolver()
export class AuthResolver {
  constructor(
    private service: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => AuthPayload)
  async register(
    @Ctx() ctx: any,
    @Arg('input', () => RegisterUserInput)
    input: RegisterUserInput,
  ) {
    const { token, user } = await this.service.register(input);
    ctx.req.user = user;
    return { token, user };
  }

  @Mutation(() => AuthPayload)
  async login(
    @Ctx() ctx: any,
    @Arg('input',  () => LoginUserInput)
    input: LoginUserInput,
  ) {
    const { token, user } = await this.service.login(input);
    ctx.req.user = user;
    return { token, user };
  }

  @Private()
  @Query(() => User)
  async user(@AuthenticatedDec() userId: UserAuthPayload) {
    return this.usersService.getUserById(userId.id);
  }

  @Private()
  @MinRole(Role.superadmin)
  @Mutation(() => User)
  async changeRole(
    @Arg('userId') userId: string,
    @Arg('role', () => Role) role: Role,
  ) {
    return this.usersService.changeRole(userId, role);
  }
}
