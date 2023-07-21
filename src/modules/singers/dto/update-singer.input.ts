import {
    IsDefined,
    IsEmail,
    IsNotIn,
    IsOptional,
    IsString,
    Length,
    Max,
    ValidateIf,
} from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateSingerInput {
    @Field()
    id: string;

    @ValidateIf((o, v) => v !== undefined)
    @IsString()
    @IsDefined()
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    bio?: string;

    @Field({ nullable: true })
    dateOfBirth?: Date;

    @Field({ nullable: true })
    avatar?: string;
}
