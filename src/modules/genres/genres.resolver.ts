import {
  Mutation,
  Root,
  Query,
  FieldResolver,
  Resolver,
  Arg,
} from 'type-graphql';
import { MinRole } from '../auth/min-role.decorator';
import { Private } from '../auth/optional.decorator';
import { Role } from '../users/user.model';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { Genre } from './genre.model';
import { GenresService } from './genres.service';

@Service()
@Resolver(() => Genre)
export class GenresResolver {
  constructor(private service: GenresService) {}
  @Query(() => [Genre])
  public genres() {
    return this.service.getAll();
  }

  @Query(() => Genre, { nullable: true })
  public genre(@Arg('id') id: string) {
    return this.service.getById(id);
  }

  @Mutation(() => Genre)
  @Private()
  @MinRole(Role.admin)
  public createGenre(@Arg('input') input: CreateGenreInput) {
    return this.service.create(input);
  }

  @Mutation(() => Genre)
  @Private()
  @MinRole(Role.admin)
  public updateGenre(@Arg('input') input: UpdateGenreInput) {
    return this.service.update(input);
  }

  @FieldResolver()
  musicCount(@Root() genre: Genre) {
    return this.service.countMusics(genre.id);
  }
}
