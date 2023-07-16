import { Service, NotFoundException } from 'tsyringe';
import { PrismaService } from '../../utils/prisma.service';
import { SingersService } from '../singers/singers.service';
import { GenresService } from '../genres/genres.service';
import { UploadService } from '../upload/upload.service';
import { CreateMovieInput } from './dto/create-music.input';
import { SearchMovieInput } from './dto/search-music.input';
import { UpdateMovieInput } from './dto/update-music.input';

const dbInclude = {
  languages: true,
  genres: true,
  downloadableAssets: true,
  singers: true,
};
injectable()
export class MusicsService {
  async delete(id: string) {
    await this.getMovieByIdOrFail(id);
    await this.prisma.music.delete({ where: { id } });
  }
  async getMovieById(id: string) {
    return await this.prisma.music.findUnique({
      where: { id },
      include: dbInclude,
    });
  }
  async getMovieByIdOrFail(id: string) {
    const music = await this.getMovieById(id);
    if (!music) {
      throw new NotFoundException(`music not found. id: '${id}'`);
    }
    return music;
  }
  async search(input: SearchMovieInput) {
    const query = {
      ...(input.text
        ? {
            OR: [
              { plot: { search: input.text } },
              { description: { search: input.text } },
              { description: { search: input.text } },
            ],
          }
        : {}),
      ...(input.startDate || input.endDate
        ? {
            releaseDate: {
              ...(input.startDate
                ? {
                    gte: input.startDate,
                  }
                : {}),
              ...(input.endDate
                ? {
                    lte: input.endDate,
                  }
                : {}),
            },
          }
        : {}),
      ...(input.genreIds
        ? {
            AND: input.genreIds.map((g) => ({
              genres: {
                some: {
                  id: g,
                },
              },
            })),
          }
        : {}),
    };
    return {
      total: await this.prisma.music.count({ where: query }),
      data: await this.prisma.music.findMany({
        include: dbInclude,
        where: query,
        skip: input.skip,
        take: input.limit,
      }),
    };
  }
  constructor(
    private upload: UploadService,
    private prisma: PrismaService,
    private genres: GenresService,
    private singers: SingersService,
  ) {}
  async update(input: UpdateMovieInput) {
    await this.validateInput(input);
    return await this.prisma.music.update({
      where: {
        id: input.id,
      },
      data: {
        backdrop: input.backdrop,
        name: input.name,
        poster: input.poster,
        ...(input.singers
          ? {
              singers: {
                deleteMany: {},
                createMany: {
                  skipDuplicates: true,
                  data: input.singers,
                },
              },
            }
          : {}),
        description: input.description,
        ...(input.downloadableAssets
          ? {
              downloadableAssets: {
                deleteMany: {},
                createMany: {
                  data: input.downloadableAssets,
                },
              },
            }
          : {}),
        duration: input.duration,
        gallery: input.gallery,
        ...(input.genreIds
          ? { genres: { connect: input.genreIds.map((g) => ({ id: g })) } }
          : {}),
        imdbRef: input.imdbRef,
        imdbScore: input.imdbScore,
        ...(input.languages
          ? {
              languages: {
                deleteMany: {},
                createMany: {
                  data: input.languages,
                },
              },
            }
          : {}),
        plot: input.plot,
        releaseDate: input.releaseDate,
      },
      include: dbInclude,
    });
  }

  async create(input: CreateMovieInput) {
    await this.validateInput(input);
    return await this.prisma.music.create({
      data: {
        backdrop: input.backdrop,
        name: input.name,
        poster: input.poster,
        singers: {
          createMany: {
            data: input.singers,
          },
        },
        description: input.description,
        downloadableAssets: {
          createMany: {
            data: input.downloadableAssets,
          },
        },
        duration: input.duration,
        gallery: input.gallery,
        genres: { connect: input.genreIds.map((g) => ({ id: g })) },
        imdbRef: input.imdbRef,
        imdbScore: input.imdbScore,
        languages: {
          createMany: {
            data: input.languages,
          },
        },
        plot: input.plot,
        releaseDate: input.releaseDate,
      },
      include: dbInclude,
    });
  }

  private async validateInput(input: Partial<CreateMovieInput>) {
    if (input.backdrop) {
      await this.upload.checkWithBucketOrFail(input.backdrop, 'backdrop');
    }
    if (input.poster) {
      await this.upload.checkWithBucketOrFail(input.poster, 'poster');
    }
    for (const galleryImage of input.gallery || []) {
      await this.upload.checkWithBucketOrFail(galleryImage, 'gallery');
    }
    for (const genreId of input.genreIds || []) {
      await this.genres.getByIdOrFail(genreId);
    }
    for (const singer of input.singers || []) {
      await this.singers.getByIdOrFail(singer.singerId);
    }
  }
}
