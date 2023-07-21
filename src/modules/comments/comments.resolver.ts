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
import { MusicsService } from "../musics/musics.service";
import { Role } from "../users/user.model";
import { UsersService } from "../users/users.service";
import { Comment } from "./comment.model";
import { CommentsService } from "./comments.service";
import { CreateCommentInput } from "./dto/create-comment.input";
import { UpdateCommentInput } from "./dto/update-comment.input";

@injectable()
@Resolver(() => Comment)
export class CommentsResolver {
    constructor(
        private service: CommentsService,
        private musics: MusicsService,
        private users: UsersService
    ) {}

    @Mutation(() => Comment)
    @Authorized()
    createComment(
        @CurrentUser() user: UserAuthPayload,
        @Arg("input") input: CreateCommentInput
    ) {
        return this.service.create(user, input);
    }

    @Mutation(() => Comment)
    @Authorized()
    updateComment(
        @CurrentUser() user: UserAuthPayload,
        @Arg("input") input: UpdateCommentInput
    ) {
        return this.service.update(user, input);
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteComment(
        @CurrentUser() user: UserAuthPayload,
        @Arg("id") id: string
    ) {
        await this.service.delete(user, id);
        return true;
    }

    @Mutation(() => Comment)
    @Authorized([Role.admin, Role.superadmin])
    approveComment(@Arg("id") id: string) {
        return this.service.approve(id);
    }

    @Query(() => [Comment])
    @Authorized([Role.admin, Role.superadmin])
    unapprovedComments(@Arg("pagination") pagination: CursorBasedPagination) {
        return this.service.unapproved(pagination);
    }
    @FieldResolver()
    music(@Root() comment: Comment) {
        return this.musics.getMusicByIdOrFail(comment.musicId);
    }

    @FieldResolver()
    user(@Root() comment: Comment) {
        return this.users.getUserByIdOrFail(comment.userId);
    }
}
