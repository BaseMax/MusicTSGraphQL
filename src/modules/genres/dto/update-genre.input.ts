import { Field, ID, InputType } from '@nestjs/graphql';
import { CreateGenreInput } from './create-genre.input';

@InputType()
export class UpdateGenreInput extends CreateGenreInput {
  @Field(() => ID)
  id: string;
}
