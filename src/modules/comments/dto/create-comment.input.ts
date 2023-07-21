import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCommentInput {
    @Field()
    text: string;

    @Field()
    musicId: string;
}
