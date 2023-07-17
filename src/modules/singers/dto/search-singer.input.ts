import { Field, InputType } from 'type-graphql';
import { Pagination } from '../../../utils/pagination.input';

@InputType()
export class SearchSingerInput extends Pagination {
  @Field({ nullable: true })
  text?: string;
}
