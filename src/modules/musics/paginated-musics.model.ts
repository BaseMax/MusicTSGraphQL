import { Field, Int, ObjectType } from "type-graphql";
import { Music } from "./music.model";

@ObjectType()
export class PaginatedMusics {
    @Field(() => Int)
    total: number;
    @Field(() => [Music])
    data: Music[];
}
