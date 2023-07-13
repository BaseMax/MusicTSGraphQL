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
import { Artist } from './artist.model';
import { ArtistsService } from './artists.service';
import { CreateArtistInput } from './dto/create-artist.input';
import { PaginatedArtist as PaginatedArtists } from './dto/paginated-artist.model';
import { SearchArtistInput } from './dto/search-artist.input';
import { UpdateArtistInput } from './dto/update-artist.input';

@Resolver(() => Artist)
export class ArtistsResolver {
  constructor(private service: ArtistsService) {}

  @Mutation(() => Boolean)
  @Private()
  @MinRole(Role.admin)
  deleteArtist(@Args('id') id: string) {
    return this.service.delete(id);
  }

  @Mutation(() => Artist)
  @Private()
  @MinRole(Role.admin)
  createArtist(@Args('input') input: CreateArtistInput) {
    return this.service.create(input);
  }

  @Mutation(() => Artist)
  @Private()
  @MinRole(Role.admin)
  updateArtist(@Args('input') input: UpdateArtistInput) {
    return this.service.update(input);
  }

  @Query(() => Artist, { nullable: true })
  artist(@Args('id') id: string) {
    return this.service.getById(id);
  }

  @Query(() => PaginatedArtists)
  searchArtists(@Args('input') input: SearchArtistInput) {
    return this.service.search(input);
  }

  @ResolveField()
  movies(@Parent() artist: Artist) {
    return this.service.getMovies(artist.id);
  }
}
