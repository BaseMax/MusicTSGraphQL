import { Field, InputType } from "type-graphql";
import { Pagination } from "../../../utils/pagination.input";

@InputType()
export class SearchAlbumInput extends Pagination {
    @Field({ nullable: true })
    text?: string;
}
