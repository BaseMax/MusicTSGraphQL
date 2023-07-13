import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Movie } from './movie.model';

@ObjectType()
export class PaginatedMovies {
  @Field(() => Int)
  total: number;
  @Field(() => [Movie])
  data: Movie[];
}
