import { ObjectType } from "type-graphql";
import PaginatedResponse from "../../utils/paginated-response";
import { Music } from "./music.model";

@ObjectType()
export class PaginatedMusics extends PaginatedResponse(Music) {}
