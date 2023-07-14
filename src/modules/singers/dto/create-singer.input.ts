import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateSingerInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  avatar?: string;
}
