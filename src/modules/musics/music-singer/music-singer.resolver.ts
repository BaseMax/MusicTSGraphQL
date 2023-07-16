import { Root, FieldResolver, Resolver } from 'type-graphql';
import { SingersService } from 'src/modules/singers/singers.service';
import { MovieSinger } from '../music.model';

injectable()
@Resolver(() => MovieSinger)
export class MovieSingerResolver {
  constructor(private singers: SingersService) {}
  @FieldResolver()
  singer(@Root() parent: any) {
    return this.singers.getByIdOrFail(parent.singerId);
  }
}
