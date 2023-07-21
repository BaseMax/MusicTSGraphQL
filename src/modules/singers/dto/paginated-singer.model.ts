import { Field, Int, ObjectType } from "type-graphql";
import { Singer } from "../singer.model";

@ObjectType()
export class PaginatedSinger {
    @Field(() => Int)
    total: number;

    @Field(() => [Singer])
    singers: Singer[];
}
