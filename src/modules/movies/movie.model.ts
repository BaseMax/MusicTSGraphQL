import {
  ObjectType,
  Field,
  ID,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { Artist } from '../artists/artist.model';
import { Comment } from '../comments/comment.model';
import { Genre } from '../genres/genre.model';

@ObjectType()
export class Movie {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  plot?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  imdbScore?: number;

  @Field({ nullable: true })
  imdbRef?: string;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => Date)
  releaseDate: Date;

  @Field()
  backdrop: string;

  @Field()
  poster: string;

  @Field(() => [String])
  gallery: string[];

  @Field(() => [Genre])
  genres: Genre[];

  @Field(() => [MovieArtist])
  artists: MovieArtist[];

  @Field(() => [DownloadableAsset])
  downloadableAssets: DownloadableAsset[];

  @Field(() => [MovieLanguage])
  languages: MovieLanguage[];

  @Field(() => [Comment])
  comments: Comment[];
}

@ObjectType()
export class MovieArtist {
  @Field(() => Artist)
  artist: Artist;

  @Field(() => Contribution)
  contribution: Contribution;
}

@ObjectType()
export class DownloadableAsset {
  @Field()
  title: string;

  @Field()
  link: string;

  @Field(() => AssetType)
  type: AssetType;
}

@ObjectType()
export class MovieLanguage {
  @Field()
  tag: string;

  @Field(() => LanguageRelation)
  for: LanguageRelation;
}

export enum LanguageRelation {
  original = 'original',
  dub = 'dub',
  subtitle = 'subtitle',
}

export enum AssetType {
  subtitle = 'subtitle',
  sound = 'sound',
  video = 'video',
}

export enum Contribution {
  actor = 'actor',
  director = 'director',
  writer = 'writer',
}

registerEnumType(LanguageRelation, { name: 'LanguageRelation' });
registerEnumType(AssetType, { name: 'AssetType' });
registerEnumType(Contribution, { name: 'Contribution' });
