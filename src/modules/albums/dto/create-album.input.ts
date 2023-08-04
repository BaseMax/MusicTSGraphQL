import { Field, InputType } from "type-graphql";
import { IsOptional, Length } from "class-validator";

@InputType()
export class CreateAlbumInput {
    @Length(1, 20)
    @Field()
    title: string;

    @Field(() => [String])
    musics: string[];

    @Field()
    cover: string;

    @IsOptional()
    @Field({ nullable: true })
    releaseDate?: Date;
}
