import { Field, InputType } from "type-graphql";
import { CursorBasedPagination } from "../../../utils/cursor-pagination";

@InputType()
export class MusicCommentsInput extends CursorBasedPagination {
    @Field()
    musicId: string;
}
