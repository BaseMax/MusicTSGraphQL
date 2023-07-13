import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MinRole } from '../auth/min-role.decorator';
import { Private } from '../auth/optional.decorator';
import { Role } from '../users/user.model';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { Genre } from './genre.model';
import { GenresService } from './genres.service';

@Resolver(() => Genre)
export class GenresResolver {
  constructor(private service: GenresService) {}
  @Query(() => [Genre])
  public genres() {
    return this.service.getAll();
  }

  @Query(() => Genre, { nullable: true })
  public genre(@Args('id') id: string) {
    return this.service.getById(id);
  }

  @Mutation(() => Genre)
  @Private()
  @MinRole(Role.admin)
  public createGenre(@Args('input') input: CreateGenreInput) {
    return this.service.create(input);
  }

  @Mutation(() => Genre)
  @Private()
  @MinRole(Role.admin)
  public updateGenre(@Args('input') input: UpdateGenreInput) {
    return this.service.update(input);
  }

  @ResolveField()
  movieCount(@Parent() genre: Genre) {
    return this.service.countMovies(genre.id);
  }
}
