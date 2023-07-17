import { injectable } from 'tsyringe';
import {
  Arg,
  Mutation,
  Root,
  Query,
  FieldResolver,
  Resolver,
} from 'type-graphql';
import { UserAuthPayload } from '../auth/dto/user.data';
import { CommentsService } from '../comments/comments.service';
import { Role } from '../users/user.model';
import { CreateMovieInput } from './dto/create-music.input';
import { SearchMovieInput } from './dto/search-music.input';
import { UpdateMovieInput } from './dto/update-music.input';
import { Music } from './music.model';
import { MusicsService } from './musics.service';
import { PaginatedMusics } from './paginated-musics.model';

@injectable()
@Resolver(() => Music)
export class MusicsResolver {
  constructor(
    private service: MusicsService,
    private commentsService: CommentsService,
  ) {}

  @Mutation(() => Music)
  @Private()
  @MinRole(Role.admin)
  async createMovie(@Arg('input') input: CreateMovieInput) {
    return this.service.create(input);
  }

  @Mutation(() => Music)
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

  @Query(() => Music, { nullable: true })
  async music(@Arg('id') id: string) {
    return this.service.getMovieById(id);
  }
  @Query(() => PaginatedMusics)
  async searchMovie(@Arg('input') input: SearchMovieInput) {
    return await this.service.search(input);
  }

  @FieldResolver()
  comments(
    @Root() music: Music,
    @Arg('pagination') pagination: CursorBasedPagination,
    @AuthenticatedDec() user?: UserAuthPayload,
  ) {
    return this.commentsService.getForMusics(music.id, pagination, user);
  }
}
