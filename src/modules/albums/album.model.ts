import { ObjectType, Field, ID } from "type-graphql";
import { Music } from "../musics/music.model";

@ObjectType()
export class Album {
    @Field(() => ID)
    id: string;

    @Field()
    title: string;

    @Field(() => [Music])
    musics: Music[];

    @Field({ nullable: true })
    releaseDate?: Date;

    @Field({ nullable: true })
    cover?: string;
}

