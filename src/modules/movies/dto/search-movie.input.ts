import { Field, InputType } from '@nestjs/graphql';
import { Pagination } from 'src/utils/pagination.input';

@InputType()
export class SearchMovieInput extends Pagination {
  @Field({ nullable: true })
  text?: string;

  @Field(() => [String], { nullable: true })
  genreIds?: string[];

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;
}
