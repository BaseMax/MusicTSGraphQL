import { PrismaService } from "../../utils/prisma.service";
import { Prisma } from "@prisma/client";
import { CreateAlbumInput } from "./dto/create-album.input";
import { UpdateAlbumInput } from "./dto/update-album.input";
import { BadRequestException } from "../../errors/badrequest.exception";
import { NotFoundException } from "../../errors/notfound.exception";
import { injectable } from "tsyringe";
import { MusicsService } from "../musics/musics.service";
import { SearchAlbumInput } from "./dto/search-album.input";

@injectable()
export class AlbumsService {
    async getMusics(id: string) {
        const musics = await this.prisma.album.findUniqueOrThrow({
            where: { id },
            include: {
                musics: {
                    include: {
                        genre: true,
                        singers: true,
                    },
                },
            },
        });
        return musics?.musics;
    }
    constructor(private prisma: PrismaService, private musics: MusicsService) { }

    public async getById(id: string) {
        return this.prisma.album.findUnique({
            where: { id },
        });
    }
    public async getByIdOrFail(id: string) {
        const album = await this.getById(id);
        if (!album) {
            throw new NotFoundException(`album not found. id : '${id}'`);
        }
        return album;
    }
    public async search(input: SearchAlbumInput) {
        const query = input.text
            ? {
                where: {
                    OR: [
                        { title: { search: input.text } },
                        {
                            musics: {
                                some: { name: { search: input.text } },
                            },
                        },
                    ],
                },
            }
            : {};
        const data = await this.prisma.album.findMany({
            skip: input.skip,
            take: input.limit,
            where: query.where,
        });
        const total = await this.prisma.album.count({
            where: query.where,
        });
        return {
            total,
            data,
        };
    }
    public async update(input: UpdateAlbumInput) {
        await this.getByIdOrFail(input.id);
        await this.validate(input);
        return await this.prisma.album.update({
            where: {
                id: input.id,
            },
            data: {
                title: input.title,
                cover: input.cover,
                ...(input.musics
                    ? {
                        musics: {
                            connect: input.musics.map((id) => ({ id })),
                        },
                    }
                    : {}),
            },
        });
    }
    private async validate(input: Partial<UpdateAlbumInput>) {
        for (const id of input.musics || []) {
            await this.musics.getMusicByIdOrFail(id);
        }
    }
    public async create(input: CreateAlbumInput) {
        await this.validate(input);
        return this.prisma.album.create({
            data: {
                title: input.title,
                cover: input.cover,
                musics: {
                    connect: input.musics.map((id) => ({ id })),
                },
            },
        });
    }
}
