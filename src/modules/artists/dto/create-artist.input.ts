import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateArtistInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  avatar?: string;
}
