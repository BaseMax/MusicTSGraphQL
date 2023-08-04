import { ObjectType } from "type-graphql";
import PaginatedResponse from "../../../utils/paginated-response";
import { Album } from "../album.model";

@ObjectType()
export class PaginatedAlbums extends PaginatedResponse(Album) {}
