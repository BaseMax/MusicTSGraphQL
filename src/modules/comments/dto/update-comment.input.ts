import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CreateCommentInput } from './create-comment.input';

@InputType()
export class UpdateCommentInput extends OmitType(CreateCommentInput, [
  'movieId',
]) {
  @Field()
  id: string;
}
