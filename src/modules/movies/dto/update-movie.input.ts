import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateMovieInput } from './create-movie.input';

@InputType()
export class UpdateMovieInput extends PartialType(CreateMovieInput) {
  @Field(() => ID)
  id: string;
}
