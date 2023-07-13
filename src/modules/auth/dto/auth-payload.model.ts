import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/user.model';

@ObjectType()
export class AuthPayload {
  @Field()
  user: User;

  @Field()
  token: string;
}
