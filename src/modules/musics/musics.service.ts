import { inject, injectable } from "tsyringe";
import { PrismaService } from "../../utils/prisma.service";
import { SingersService } from "../singers/singers.service";
import { GenresService } from "../genres/genres.service";
import { UploadService } from "../upload/upload.service";
import { CreateMusicInput } from "./dto/create-music.input";
import { SearchMusicInput } from "./dto/search-music.input";
import { UpdateMusicInput } from "./dto/update-music.input";
import { NotFoundException } from "../../errors";
import { PrismaClient } from "@prisma/client";

const dbInclude = {
    genre: true,
    singers: true,
};
@injectable()
export class MusicsService {
    async delete(id: string) {
        await this.getMusicByIdOrFail(id);
        await this.prisma.music.delete({ where: { id } });
    }
    async getMusicById(id: string) {
        return await this.prisma.music.findUnique({
            where: { id },
            include: dbInclude,
        });
    }
    async getMusicByIdOrFail(id: string) {
        const music = await this.getMusicById(id);
        if (!music) {
            throw new NotFoundException(`music not found. id: '${id}'`);
        }
        return music;
    }
    async search(input: SearchMusicInput) {
        const query = {
            ...(input.text
                ? {
                      OR: [
                          { name: { search: input.text } },
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
            genreId: input.genreId,
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
        @inject(PrismaService) private prisma: PrismaClient,
        private genres: GenresService,
        private singers: SingersService
    ) {}
    async update(input: UpdateMusicInput) {
        await this.validateInput(input);
        return await this.prisma.music.update({
            where: {
                id: input.id,
            },
            data: {
                name: input.name,
                description: input.description,
                duration: input.duration,
                genreId: input.genreId,
                releaseDate: input.releaseDate,
                ...(input.singers
                    ? {
                          singers: {
                              connect: input.singers.map((i) => ({ id: i })),
                          },
                      }
                    : {}),
            },
            include: dbInclude,
        });
    }

    async create(input: CreateMusicInput) {
        await this.validateInput(input);
        return await this.prisma.music.create({
            data: {
                name: input.name,
                cover: input.cover,
                link: input.link,
                description: input.description,

                duration: input.duration,
                genre: { connect: { id: input.genreId } },

                releaseDate: input.releaseDate,
                singers: {
                    connect: input.singers.map((s) => ({ id: s })),
                },
            },
            include: dbInclude,
        });
    }

    private async validateInput(input: Partial<UpdateMusicInput>) {
        if (input.link) {
            await this.upload.checkWithBucketOrFail(input.link, "musics");
        }
        if (input.cover) {
            await this.upload.checkWithBucketOrFail(input.cover, "covers");
        }
        if (input.genreId) {
            await this.genres.getByIdOrFail(input.genreId);
        }
        for (const singer of input.singers || []) {
            await this.singers.getByIdOrFail(singer);
        }
    }
}
