import { Field, InputType, OmitType } from 'type-graphql';
import { CreateCommentInput } from './create-comment.input';

@InputType()
export class UpdateCommentInput extends OmitType(CreateCommentInput, [
  'movieId',
]) {
  @Field()
  id: string;
}
