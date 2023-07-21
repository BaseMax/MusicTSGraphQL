import {
    Arg,
    Mutation,
    Root,
    Query,
    FieldResolver,
    Resolver,
    Authorized,
} from "type-graphql";
import { Role } from "../users/user.model";
import { Singer } from "./singer.model";
import { SingersService } from "./singers.service";
import { CreateSingerInput } from "./dto/create-singer.input";
import { PaginatedSinger as PaginatedSingers } from "./dto/paginated-singer.model";
import { SearchSingerInput } from "./dto/search-singer.input";
import { UpdateSingerInput } from "./dto/update-singer.input";
import { injectable } from "tsyringe";

@injectable()
@Resolver(() => Singer)
export class SingersResolver {
    constructor(private service: SingersService) {}

    @Mutation(() => Boolean)
    @Authorized([Role.admin, Role.superadmin])
    deleteSinger(@Arg("id") id: string) {
        return this.service.delete(id);
    }

    @Mutation(() => Singer)
    @Authorized([Role.admin, Role.superadmin])
    createSinger(@Arg("input") input: CreateSingerInput) {
        return this.service.create(input);
    }

    @Mutation(() => Singer)
    @Authorized([Role.admin, Role.superadmin])
    updateSinger(@Arg("input") input: UpdateSingerInput) {
        return this.service.update(input);
    }

    @Query(() => Singer, { nullable: true })
    singer(@Arg("id") id: string) {
        return this.service.getById(id);
    }

    @Query(() => PaginatedSingers)
    searchSingers(@Arg("input") input: SearchSingerInput) {
        return this.service.search(input);
    }

    @FieldResolver()
    musics(@Root() singer: Singer) {
        return this.service.getMusics(singer.id);
    }
}
