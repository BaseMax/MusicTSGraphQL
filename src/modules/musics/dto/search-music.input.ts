import { Field, InputType } from "type-graphql";
import { Pagination } from "../../../utils/pagination.input";

@InputType()
export class SearchMusicInput extends Pagination {
    @Field({ nullable: true })
    text?: string;

    @Field({ nullable: true })
    genreId?: string;

    @Field({ nullable: true })
    startDate?: Date;

    @Field({ nullable: true })
    endDate?: Date;
}
