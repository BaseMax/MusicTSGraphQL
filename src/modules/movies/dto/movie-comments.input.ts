import { Field, InputType } from '@nestjs/graphql';
import { CursorBasedPagination } from 'src/utils/cursor-pagination';

@InputType()
export class MovieCommentsInput extends CursorBasedPagination {
  @Field()
  movieId: string;
}
