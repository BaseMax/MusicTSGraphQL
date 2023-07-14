import { ObjectType, Field, ID } from 'type-graphql';
import { Movie } from '../musics/music.model';

@ObjectType()
export class Singer {
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
  musics: Movie[];
}
