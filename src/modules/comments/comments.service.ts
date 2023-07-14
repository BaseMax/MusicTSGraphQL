import {
  ForbiddenException,
  Service,
  NotFoundException,
} from 'typedi';
import { PrismaClient } from '@prisma/client';
import { CursorBasedPagination } from 'src/utils/cursor-pagination';
import { UserAuthPayload } from '../auth/dto/user.data';
import { MusicsService } from '../musics/musics.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

@Service()
export class CommentsService {
  getForMusics(
    musicId: string,
    pagination: CursorBasedPagination,
    user: UserAuthPayload | undefined,
  ) {
    return this.prisma.comment.findMany({
      take: pagination.limit,
      ...(pagination.cursor
        ? {
            cursor: {
              id: pagination.cursor,
            },
          }
        : {}),
      skip: pagination.cursor ? 1 : 0,
      where: {
        musicId,
        OR: [
          {
            isApproved: true,
          },
          ...(user
            ? [
                {
                  userId: user.id,
                },
              ]
            : []),
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async unapproved(pagination: CursorBasedPagination) {
    return await this.prisma.comment.findMany({
      ...(pagination.cursor
        ? {
            cursor: {
              id: pagination.cursor,
            },
          }
        : {}),
      where: {
        isApproved: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: pagination.cursor ? 1 : 0,
      take: pagination.limit,
    });
  }
  async approve(id: string) {
    return await this.prisma.comment.update({
      where: { id },
      data: {
        isApproved: true,
      },
    });
  }
  async delete(user: UserAuthPayload, id: string) {
    const comment = await this.getByIdOrFail(id);
    if (comment.userId !== user.id && user.role === 'user') {
      throw new ForbiddenException('could not delete comment');
    }
    await this.prisma.comment.delete({ where: { id } });
  }
  async update(user: UserAuthPayload, input: UpdateCommentInput) {
    const comment = await this.getByIdOrFail(input.id);
    if (user.id !== comment.userId) {
      throw new ForbiddenException('could not edit comment');
    }
    return await this.prisma.comment.update({
      where: {
        id: input.id,
      },
      data: {
        text: input.text,
      },
    });
  }

  async getByIdOrFail(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`comment not found. id: '${id}'`);
    }
    return comment;
  }
  constructor(private prisma: PrismaClient, private musics: MusicsService) {}
  async create(auth: UserAuthPayload, input: CreateCommentInput) {
    await this.musics.getMovieByIdOrFail(input.musicId);
    return await this.prisma.comment.create({
      data: {
        text: input.text,
        musicId: input.musicId,
        userId: auth.id,
      },
    });
  }
}
