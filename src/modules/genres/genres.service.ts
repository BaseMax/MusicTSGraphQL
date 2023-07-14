import { Service } from 'typedi';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { BadRequestException } from '../../errors/badrequest.exception';
import { NotFoundException } from '../../errors/notfound.exception';

@Service()
export class GenresService {
  async countMusics(id: string) {
    const data = await this.prisma.genre.findUniqueOrThrow({
      where: { id },
      include: {
        _count: {
          select: {
            musics: true,
          },
        },
      },
    });
    return data._count.musics;
  }
  constructor(private prisma: PrismaClient) { }

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
