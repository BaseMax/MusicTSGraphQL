import { ObjectType } from "type-graphql";
import PaginatedResponse from "../../../utils/paginated-response";
import { Singer } from "../singer.model";

@ObjectType()
export class PaginatedSinger extends PaginatedResponse(Singer) {}
