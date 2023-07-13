import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Artist } from '../artist.model';

@ObjectType()
export class PaginatedArtist {
  @Field(() => Int)
  total: number;

  @Field(() => [Artist])
  artists: Artist[];
}
