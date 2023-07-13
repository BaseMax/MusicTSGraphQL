import { Field, Int, ObjectType } from 'type-graphql';
import { Movie } from './movie.model';

@ObjectType()
export class PaginatedMovies {
  @Field(() => Int)
  total: number;
  @Field(() => [Movie])
  data: Movie[];
}
