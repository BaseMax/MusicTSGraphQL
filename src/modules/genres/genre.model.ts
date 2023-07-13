import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Genre {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  movieCount: number;
}
