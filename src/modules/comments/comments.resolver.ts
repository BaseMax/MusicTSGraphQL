import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CursorBasedPagination } from 'src/utils/cursor-pagination';
import { AuthenticatedDec } from '../auth/authenticated-user.decorator';
import { UserAuthPayload } from '../auth/dto/user.data';
import { MinRole } from '../auth/min-role.decorator';
import { Private } from '../auth/optional.decorator';
import { MoviesService } from '../movies/movies.service';
import { Role } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { Comment } from './comment.model';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private service: CommentsService,
    private movies: MoviesService,
    private users: UsersService,
  ) {}

  @Mutation(() => Comment)
  @Private()
  createComment(
    @AuthenticatedDec() user: UserAuthPayload,
    @Args('input') input: CreateCommentInput,
  ) {
    return this.service.create(user, input);
  }

  @Mutation(() => Comment)
  @Private()
  updateComment(
    @AuthenticatedDec() user: UserAuthPayload,
    @Args('input') input: UpdateCommentInput,
  ) {
    return this.service.update(user, input);
  }

  @Mutation(() => Boolean)
  @Private()
  async deleteComment(
    @AuthenticatedDec() user: UserAuthPayload,
    @Args('id') id: string,
  ) {
    await this.service.delete(user, id);
    return true;
  }

  @Mutation(() => Comment)
  @Private()
  @MinRole(Role.admin)
  approveComment(@Args('id') id: string) {
    return this.service.approve(id);
  }

  @Query(() => [Comment])
  @Private()
  @MinRole(Role.admin)
  unapprovedComments(@Args('pagination') pagination: CursorBasedPagination) {
    return this.service.unapproved(pagination);
  }
  @ResolveField()
  movie(@Parent() comment: Comment) {
    return this.movies.getMovieByIdOrFail(comment.movieId);
  }

  @ResolveField()
  user(@Parent() comment: Comment) {
    return this.users.getUserByIdOrFail(comment.userId);
  }
}
