import { Field, InputType } from '@nestjs/graphql';
import { Pagination } from 'src/utils/pagination.input';

@InputType()
export class SearchArtistInput extends Pagination {
  @Field({ nullable: true })
  text?: string;
}
