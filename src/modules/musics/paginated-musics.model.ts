import { Field, Int, ObjectType } from 'type-graphql';
import { Movie } from './music.model';

@ObjectType()
export class PaginatedMusics {
  @Field(() => Int)
  total: number;
  @Field(() => [Movie])
  data: Movie[];
}
