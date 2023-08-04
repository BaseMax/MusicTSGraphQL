import { InputType, Field, Float } from "type-graphql";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

@InputType()
export class CreateMusicInput {
    @IsString()
    @MaxLength(100)
    @Field()
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    @Field({ nullable: true })
    description?: string;

    @IsOptional()
    @Field(() => Float, { nullable: true })
    duration?: number;

    @Field(() => Date)
    releaseDate?: Date;

    @IsNotEmpty()
    @Field()
    cover: string;

    @IsNotEmpty()
    @Field()
    link: string;

    @IsNotEmpty()
    @Field()
    genreId: string;

    @Field(() => [String])
    singers: string[];
}
