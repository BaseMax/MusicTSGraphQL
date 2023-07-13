import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { movieInclude } from '../movies/movieInclude';
import { UploadService } from '../upload/upload.service';
import { CreateArtistInput } from './dto/create-artist.input';
import { SearchArtistInput } from './dto/search-artist.input';
import { UpdateArtistInput } from './dto/update-artist.input';

@Injectable()
export class ArtistsService {
  async getMovies(id: string) {
    const movies = await this.prisma.artist.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        movies: {
          include: {
            movie: {
              include: movieInclude,
            },
          },
        },
      },
    });
    return movies.movies.map((m) => m.movie);
  }
  async search(input: SearchArtistInput) {
    const query = input.text
      ? {
          OR: [
            {
              name: { search: input.text },
            },
            {
              bio: { search: input.text },
            },
          ],
        }
      : {};
    return {
      total: await this.prisma.artist.count({
        where: query,
      }),
      artists: await this.prisma.artist.findMany({
        where: query,
        skip: input.skip,
        take: input.limit,
      }),
    };
  }
  async delete(id: string) {
    await this.getByIdOrFail(id);
    await this.prisma.artist.delete({
      where: { id },
    });
    return true;
  }

  constructor(private prisma: PrismaService, private upload: UploadService) {}

  async getById(id: string) {
    return await this.prisma.artist.findUnique({
      where: { id },
    });
  }

  async getByIdOrFail(id: string) {
    const artist = await this.getById(id);
    if (!artist) {
      throw new NotFoundException(`artist not found. id: '${id}'`);
    }
    return artist;
  }

  async update(input: UpdateArtistInput) {
    await this.getByIdOrFail(input.id);
    if (input.avatar) {
      await this.upload.checkWithBucketOrFail(input.avatar, 'avatars');
    }
    return this.prisma.artist.update({
      where: { id: input.id },
      data: {
        avatar: input.avatar,
        bio: input.bio,
        dateOfBirth: input.dateOfBirth,
        name: input.name,
      },
    });
  }

  async create(input: CreateArtistInput) {
    if (input.avatar) {
      await this.upload.checkWithBucketOrFail(input.avatar, 'avatars');
    }
    return this.prisma.artist.create({
      data: {
        avatar: input.avatar,
        name: input.name,
        bio: input.bio,
        dateOfBirth: input.dateOfBirth,
      },
    });
  }
}
