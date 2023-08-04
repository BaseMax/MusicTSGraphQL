import { Field, InputType } from "type-graphql";
import { IsOptional, Length, ValidateIf } from "class-validator";

@InputType()
export class UpdateAlbumInput {
    @Field()
    id: string;
    @ValidateIf((_, v) => v !== undefined)
    @Length(1, 20)
    @Field({ nullable: true })
    title: string;

    @ValidateIf((_, v) => v !== undefined)
    @Field(() => [String], { nullable: true })
    musics: string[];

    @Field({ nullable: true })
    cover: string;

    @IsOptional()
    @Field({ nullable: true })
    releaseDate?: Date;
}
