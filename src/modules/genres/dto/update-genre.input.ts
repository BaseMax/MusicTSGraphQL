import { Field, ID, InputType } from 'type-graphql';
import { CreateGenreInput } from './create-genre.input';

@InputType()
export class UpdateGenreInput extends CreateGenreInput {
  @Field(() => ID)
  id: string;
}
