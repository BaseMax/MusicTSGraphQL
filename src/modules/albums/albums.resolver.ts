import { injectable } from "tsyringe";
import {
    Mutation,
    Root,
    Query,
    FieldResolver,
    Resolver,
    Arg,
    Authorized,
} from "type-graphql";
import { Role } from "../users/user.model";
import { CreateAlbumInput } from "./dto/create-album.input";
import { UpdateAlbumInput } from "./dto/update-album.input";
import { Album } from "./album.model";
import { AlbumsService } from "./albums.service";
import { PaginatedAlbums } from "./dto/paginated-albums.model";
import { SearchAlbumInput } from "./dto/search-album.input";

@injectable()
@Resolver(() => Album)
export class AlbumsResolver {
    constructor(private service: AlbumsService) {}

    @Query(() => Album, { nullable: true })
    public album(@Arg("id") id: string) {
        return this.service.getById(id);
    }

    @Authorized([Role.admin, Role.superadmin])
    @Mutation(() => Album)
    public createAlbum(@Arg("input") input: CreateAlbumInput) {
        return this.service.create(input);
    }

    @Mutation(() => Album)
    @Authorized([Role.admin, Role.superadmin])
    public updateAlbum(@Arg("input") input: UpdateAlbumInput) {
        return this.service.update(input);
    }

    @FieldResolver()
    async musics(@Root() parent: Album) {
        return this.service.getMusics(parent.id);
    }

    @Query(() => PaginatedAlbums)
    public async searchAlbums(@Arg("input") input: SearchAlbumInput) {
        return this.service.search(input);
    }
}
