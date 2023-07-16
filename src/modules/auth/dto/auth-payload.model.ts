import { Field, ObjectType } from 'type-graphql';
import { User } from '../../users/user.model';

@ObjectType()
export class AuthPayload {
  @Field()
  user: User;

  @Field()
  token: string;
}
