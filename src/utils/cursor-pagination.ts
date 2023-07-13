import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class CursorBasedPagination {
  @Min(0)
  @Max(32)
  @Field(() => Int, { defaultValue: 16 })
  limit: number;

  @Field({ nullable: true })
  cursor: string;
}
