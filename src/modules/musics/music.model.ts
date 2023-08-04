import { ObjectType, Field, ID, Float } from "type-graphql";
import { Singer } from "../singers/singer.model";
import { Comment } from "../comments/comment.model";
import { Genre } from "../genres/genre.model";

@ObjectType()
export class Music {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Float, { nullable: true })
    duration?: number;

    @Field(() => Date, { nullable: true })
    releaseDate?: Date;

    @Field()
    cover: string;

    @Field()
    link: string;

    @Field(() => Genre)
    genre: Genre;

    @Field(() => [Singer])
    singers: Singer[];

    @Field(() => [Comment])
    comments: Comment[];
}
