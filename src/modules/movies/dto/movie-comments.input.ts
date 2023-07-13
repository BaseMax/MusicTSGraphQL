import { Field, InputType } from 'type-graphql';
import { CursorBasedPagination } from 'src/utils/cursor-pagination';

@InputType()
export class MovieCommentsInput extends CursorBasedPagination {
  @Field()
  movieId: string;
}
