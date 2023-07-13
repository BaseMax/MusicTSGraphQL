import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ArtistsService } from 'src/modules/artists/artists.service';
import { MovieArtist } from '../movie.model';

@Resolver(() => MovieArtist)
export class MovieArtistResolver {
  constructor(private artists: ArtistsService) {}
  @ResolveField()
  artist(@Parent() parent: any) {
    return this.artists.getByIdOrFail(parent.artistId);
  }
}
