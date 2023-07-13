import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  text: string;

  @Field()
  movieId: string;
}
