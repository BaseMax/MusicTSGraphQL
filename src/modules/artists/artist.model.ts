import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Movie } from '../movies/movie.model';

@ObjectType()
export class Artist {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => [Movie])
  movies: Movie[];
}
