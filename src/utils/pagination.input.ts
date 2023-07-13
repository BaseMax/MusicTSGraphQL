import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class Pagination {
  @Min(0)
  @Max(32)
  @Field(() => Int, { defaultValue: 16 })
  limit: number;

  @Min(0)
  @Field(() => Int, { defaultValue: 0 })
  skip: number;
}
