import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateCommentInput {
    @Field()
    id: string;

    @Field()
    text: string;
}
