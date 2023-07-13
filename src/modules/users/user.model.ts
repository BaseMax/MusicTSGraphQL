import { registerEnumType } from 'type-graphql';
import { Field, ID, ObjectType } from 'type-graphql';

export enum Role {
  user = 'user',
  admin = 'admin',
  superadmin = 'superadmin',
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;

  email: string;
  password: string;
}

registerEnumType(Role, {
  name: 'Role',
});
