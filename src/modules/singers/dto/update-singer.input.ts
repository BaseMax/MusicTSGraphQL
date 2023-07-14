import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateSingerInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  avatar?: string;
}
