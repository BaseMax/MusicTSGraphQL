import { injectable } from "tsyringe";
import {
    Arg,
    Mutation,
    Root,
    Query,
    FieldResolver,
    Resolver,
    Authorized,
} from "type-graphql";
import { CursorBasedPagination } from "../../utils/cursor-pagination";
import { CurrentUser } from "../auth/current-user.decorator";
import { UserAuthPayload } from "../auth/dto/user.data";
import { CommentsService } from "../comments/comments.service";
import { Role } from "../users/user.model";
import { CreateMusicInput } from "./dto/create-music.input";
import { SearchMusicInput } from "./dto/search-music.input";
import { UpdateMusicInput } from "./dto/update-music.input";
import { Music } from "./music.model";
import { MusicsService } from "./musics.service";
import { PaginatedMusics } from "./paginated-musics.model";

@injectable()
@Resolver(() => Music)
export class MusicsResolver {
    constructor(
        private service: MusicsService,
        private commentsService: CommentsService
    ) {}

    @Mutation(() => Music)
    @Authorized([Role.admin, Role.superadmin])
    async createMusic(@Arg("input") input: CreateMusicInput) {
        return this.service.create(input);
    }

    @Mutation(() => Music)
    @Authorized([Role.admin, Role.superadmin])
    async updateMusic(@Arg("input") input: UpdateMusicInput) {
        return this.service.update(input);
    }

    @Mutation(() => Boolean)
    @Authorized([Role.admin, Role.superadmin])
    async deleteMusic(@Arg("id") id: string) {
        await this.service.delete(id);
        return true;
    }

    @Query(() => Music, { nullable: true })
    async music(@Arg("id") id: string) {
        return this.service.getMusicById(id);
    }
    @Query(() => PaginatedMusics)
    async searchMusic(@Arg("input") input: SearchMusicInput) {
        return await this.service.search(input);
    }

    @FieldResolver()
    comments(
        @Root() music: Music,
        @Arg("pagination") pagination: CursorBasedPagination,
        @CurrentUser() user?: UserAuthPayload
    ) {
        return this.commentsService.getForMusics(music.id, pagination, user);
    }
}
