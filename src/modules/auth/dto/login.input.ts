import { Field, InputType } from "type-graphql";
import { IsEmail } from "class-validator";

@InputType()
export class LoginUserInput {
    @IsEmail()
    @Field()
    email: string;

    @Field()
    password: string;
}
