import {
    IsDefined,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateIf,
} from "class-validator";
import { Field, Float, ID, InputType } from "type-graphql";

@InputType()
export class UpdateMusicInput {
    @Field(() => ID)
    id: string;

    @IsString()
    @MaxLength(100)
    @Field()
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    @Field(() => String, { nullable: true })
    description?: string | null;

    @IsOptional()
    @Field(() => Float, { nullable: true })
    duration?: number | null;

    @Field(() => Date)
    releaseDate?: Date | null;

    @ValidateIf((_, v) => v !== undefined)
    @IsDefined()
    @IsNotEmpty()
    @Field()
    cover?: string;

    @ValidateIf((_, v) => v !== undefined)
    @IsDefined()
    @IsNotEmpty()
    @Field()
    link?: string;

    @ValidateIf((_, v) => v !== undefined)
    @IsDefined()
    @IsNotEmpty()
    @Field()
    genreId?: string;

    @ValidateIf((_, v) => v !== undefined)
    @IsDefined()
    @Field(() => [String])
    singers?: string[];
}
