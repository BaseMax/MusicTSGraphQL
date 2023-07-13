import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';

@Injectable()
export class GenresService {
  async countMovies(id: string) {
    const data = await this.prisma.genre.findUniqueOrThrow({
      where: { id },
      include: {
        _count: {
          select: {
            movies: true,
          },
        },
      },
    });
    return data._count.movies;
  }
  constructor(private prisma: PrismaService) {}

  public async getById(id: string) {
    return this.prisma.genre.findUnique({
      where: { id },
    });
  }
  public async getByIdOrFail(id: string) {
    const genre = await this.getById(id);
    if (!genre) {
      throw new NotFoundException(`genre not found. id : '${id}'`);
    }
    return genre;
  }
  public async update(input: UpdateGenreInput) {
    await this.getByIdOrFail(input.id);
    try {
      return await this.prisma.genre.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('name conflicting');
        }
      }
      throw e;
    }
  }
  public async create(input: CreateGenreInput) {
    if (await this.prisma.genre.findUnique({ where: { name: input.name } })) {
      throw new BadRequestException('genre already exists');
    }
    return this.prisma.genre.create({
      data: {
        name: input.name,
      },
    });
  }
  public getAll() {
    return this.prisma.genre.findMany();
  }
}
