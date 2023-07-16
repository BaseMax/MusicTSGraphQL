import {
  Arg,
  Mutation,
  Root,
  Query,
  FieldResolver,
  Resolver,
} from 'type-graphql';
import { CursorBasedPagination } from 'src/utils/cursor-pagination';
import { AuthenticatedDec } from '../auth/authenticated-user.decorator';
import { UserAuthPayload } from '../auth/dto/user.data';
import { MinRole } from '../auth/min-role.decorator';
import { Private } from '../auth/optional.decorator';
import { MusicsService } from '../musics/musics.service';
import { Role } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { Comment } from './comment.model';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

injectable()
@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private service: CommentsService,
    private musics: MusicsService,
    private users: UsersService,
  ) {}

  @Mutation(() => Comment)
  @Private()
  createComment(
    @AuthenticatedDec() user: UserAuthPayload,
    @Arg('input') input: CreateCommentInput,
  ) {
    return this.service.create(user, input);
  }

  @Mutation(() => Comment)
  @Private()
  updateComment(
    @AuthenticatedDec() user: UserAuthPayload,
    @Arg('input') input: UpdateCommentInput,
  ) {
    return this.service.update(user, input);
  }

  @Mutation(() => Boolean)
  @Private()
  async deleteComment(
    @AuthenticatedDec() user: UserAuthPayload,
    @Arg('id') id: string,
  ) {
    await this.service.delete(user, id);
    return true;
  }

  @Mutation(() => Comment)
  @Private()
  @MinRole(Role.admin)
  approveComment(@Arg('id') id: string) {
    return this.service.approve(id);
  }

  @Query(() => [Comment])
  @Private()
  @MinRole(Role.admin)
  unapprovedComments(@Arg('pagination') pagination: CursorBasedPagination) {
    return this.service.unapproved(pagination);
  }
  @FieldResolver()
  music(@Root() comment: Comment) {
    return this.musics.getMovieByIdOrFail(comment.musicId);
  }

  @FieldResolver()
  user(@Root() comment: Comment) {
    return this.users.getUserByIdOrFail(comment.userId);
  }
}
