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
import { CommentsService } from '../comments/comments.service';
import { Role } from '../users/user.model';
import { CreateMovieInput } from './dto/create-music.input';
import { SearchMovieInput } from './dto/search-music.input';
import { UpdateMovieInput } from './dto/update-music.input';
import { Movie } from './music.model';
import { MusicsService } from './musics.service';
import { PaginatedMusics } from './paginated-musics.model';

injectable()
@Resolver(() => Movie)
export class MusicsResolver {
  constructor(
    private service: MusicsService,
    private commentsService: CommentsService,
  ) {}

  @Mutation(() => Movie)
  @Private()
  @MinRole(Role.admin)
  async createMovie(@Arg('input') input: CreateMovieInput) {
    return this.service.create(input);
  }

  @Mutation(() => Movie)
  @Private()
  @MinRole(Role.admin)
  async updateMovie(@Arg('input') input: UpdateMovieInput) {
    return this.service.update(input);
  }

  @Mutation(() => Boolean)
  @Private()
  @MinRole(Role.admin)
  async deleteMovie(@Arg('id') id: string) {
    await this.service.delete(id);
    return true;
  }

  @Query(() => Movie, { nullable: true })
  async music(@Arg('id') id: string) {
    return this.service.getMovieById(id);
  }
  @Query(() => PaginatedMusics)
  async searchMovie(@Arg('input') input: SearchMovieInput) {
    return await this.service.search(input);
  }

  @FieldResolver()
  comments(
    @Root() music: Movie,
    @Arg('pagination') pagination: CursorBasedPagination,
    @AuthenticatedDec() user?: UserAuthPayload,
  ) {
    return this.commentsService.getForMusics(music.id, pagination, user);
  }
}
