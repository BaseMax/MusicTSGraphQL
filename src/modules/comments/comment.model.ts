import { Field, ID, ObjectType } from 'type-graphql';
import { Music } from '../musics/music.model';
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

  @Field(() => Music)
  music: Music;
  musicId: string;
}
