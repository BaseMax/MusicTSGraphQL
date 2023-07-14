import { InputType, Field, Float, Int } from 'type-graphql';
import { AssetType, Contribution, LanguageRelation } from '../music.model';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateMovieInput {
  @IsString()
  @MaxLength(100)
  @Field()
  name: string;

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

  @IsNotEmpty()
  @Field(() => Date)
  releaseDate: Date;

  @IsNotEmpty()
  @Field()
  backdrop: string;

  @IsNotEmpty()
  @Field()
  poster: string;

  @Field(() => [String])
  gallery: string[];

  @IsNotEmpty()
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

@InputType()
export class CreateMovieSingerInput {
  @IsNotEmpty()
  @Field()
  singerId: string;

  @IsNotEmpty()
  @Field(() => Contribution)
  contribution: Contribution;
}

@InputType()
export class CreateDownloadableAssetInput {
  @IsNotEmpty()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  @Field()
  link: string;

  @IsNotEmpty()
  @Field(() => AssetType)
  type: AssetType;
}

const VALID_LANGUAGE_TAGS = [
  'en',
  'fa',
  'fr',
  'de',
  'es',
  'it',
  'ja',
  'ko',
  'pt',
  'ru',
  'zh',
];

@InputType()
export class CreateMovieLanguageInput {
  @IsNotEmpty()
  @IsString()
  @IsIn(VALID_LANGUAGE_TAGS, { message: 'Invalid language tag' })
  @Field()
  tag: string;

  @IsNotEmpty()
  @Field(() => LanguageRelation)
  for: LanguageRelation;
}