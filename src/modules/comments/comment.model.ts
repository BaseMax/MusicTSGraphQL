import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Movie } from '../movies/movie.model';
import { User } from '../users/user.model';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  isApproved: boolean;

  @Field()
  user: User;
  userId: string;

  @Field(() => Movie)
  movie: Movie;
  movieId: string;
}
