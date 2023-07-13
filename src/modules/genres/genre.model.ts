import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Genre {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  movieCount: number;
}
