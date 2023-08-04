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

    @ValidateIf((_, v) => v !== undefined)
    @IsString()
    @MaxLength(100)
    @Field({ nullable: true })
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    @Field(() => String, { nullable: true })
    description?: string | null;

    @IsOptional()
    @Field(() => Float, { nullable: true })
    duration?: number | null;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    releaseDate?: Date | null;

    @ValidateIf((_, v) => v !== undefined)
    @IsDefined()
    @IsNotEmpty()
    @Field({ nullable: true })
    cover?: string;

    @ValidateIf((_, v) => v !== undefined)
    @IsDefined()
    @IsNotEmpty()
    @Field({ nullable: true })
    link?: string;

    @ValidateIf((_, v) => v !== undefined)
    @IsDefined()
    @IsNotEmpty()
    @Field({ nullable: true })
    genreId?: string;

    @ValidateIf((_, v) => v !== undefined)
    @IsDefined()
    @Field(() => [String], { nullable: true })
    singers?: string[];
}
