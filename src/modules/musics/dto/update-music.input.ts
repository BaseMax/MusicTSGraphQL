import { Field, ID, InputType,  } from 'type-graphql';
import { CreateMovieInput } from './create-music.input';

@InputType()
export class UpdateMovieInput extends PartialType(CreateMovieInput) {
  @Field(() => ID)
  id: string;



  @IsString()
  @MaxLength(100)
  @Field({nullable:true})
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Field({ nullable: true })
  plot?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  @Min(0)
  @Max(10)
  imdbScore?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  imdbRef?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => Date,{nullable:true})
  releaseDate?: Date;

  @Field({nullable:true})
  backdrop?: string;

  @Field()
  poster: string;

  @Field(() => [String])
  gallery: string[];

  @Field(() => [String])
  genreIds: string[];

  @ValidateNested({ each: true })
  @Type(() => CreateMovieSingerInput)
  @Field(() => [CreateMovieSingerInput])
  singers: CreateMovieSingerInput[];

  @ValidateNested({ each: true })
  @Type(() => CreateDownloadableAssetInput)
  @Field(() => [CreateDownloadableAssetInput])
  downloadableAssets: CreateDownloadableAssetInput[];

  @ValidateNested({ each: true })
  @Type(() => CreateMovieLanguageInput)
  @Field(() => [CreateMovieLanguageInput])
  languages: CreateMovieLanguageInput[];
}
