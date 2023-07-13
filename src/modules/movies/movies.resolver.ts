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
import { CommentsService } from '../comments/comments.service';
import { Role } from '../users/user.model';
import { CreateMovieInput } from './dto/create-movie.input';
import { SearchMovieInput } from './dto/search-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { Movie } from './movie.model';
import { MoviesService } from './movies.service';
import { PaginatedMovies } from './paginated-movies.model';

@Resolver(() => Movie)
export class MoviesResolver {
  constructor(
    private service: MoviesService,
    private commentsService: CommentsService,
  ) {}

  @Mutation(() => Movie)
  @Private()
  @MinRole(Role.admin)
  async createMovie(@Args('input') input: CreateMovieInput) {
    return this.service.create(input);
  }

  @Mutation(() => Movie)
  @Private()
  @MinRole(Role.admin)
  async updateMovie(@Args('input') input: UpdateMovieInput) {
    return this.service.update(input);
  }

  @Mutation(() => Boolean)
  @Private()
  @MinRole(Role.admin)
  async deleteMovie(@Args('id') id: string) {
    await this.service.delete(id);
    return true;
  }

  @Query(() => Movie, { nullable: true })
  async movie(@Args('id') id: string) {
    return this.service.getMovieById(id);
  }
  @Query(() => PaginatedMovies)
  async searchMovie(@Args('input') input: SearchMovieInput) {
    return await this.service.search(input);
  }

  @ResolveField()
  comments(
    @Parent() movie: Movie,
    @Args('pagination') pagination: CursorBasedPagination,
    @AuthenticatedDec() user?: UserAuthPayload,
  ) {
    return this.commentsService.getForMovies(movie.id, pagination, user);
  }
}
