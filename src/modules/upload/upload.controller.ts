import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { authChecker } from "../../authChecker";
import { getUserFromToken } from "../auth/get-user-from-token";
import { Role } from "../users/user.model";
import { UploadService } from "./upload.service";
import * as Errors from "../../errors";
import fastifyMultipart from "@fastify/multipart";
export async function uploadRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", (req, _rep, done) => {
        if (req.headers.authorization) {
            try {
                req.user = getUserFromToken(req.headers.authorization);
            } catch {
                throw new Errors.UnauthorizedException();
            }
        } else {
            throw new Errors.UnauthorizedException();
        }

        if (!authChecker([Role.admin, Role.superadmin])(req.user))
            throw new Errors.UnauthorizedException();
        done();
    });
    const uploadService = container.resolve(UploadService);
    fastify.register(fastifyMultipart, {
        limits: {
            fileSize: 20 * 1024 * 1024,
        },
    });

    interface UploadParams {
        name: string;
    }
    fastify.post<{ Params: UploadParams }>("/upload/cover/:name", {
        handler: async (req, reply) => {
            const name = req.params.name;
            const data = await req.file();
            const buffer = await data?.toBuffer();
            if (!buffer) {
                throw new Errors.BadRequestException("file required");
            }
            const url = await uploadService.uploadCover({
                image: buffer,
                name,
            });
            reply.send({ url });
        },
    });
    fastify.post<{ Params: UploadParams }>("/upload/avatars/:name", {
        handler: async (req, reply) => {
            const name = req.params.name;
            const data = await req.file();
            const buffer = await data?.toBuffer();
            if (!buffer) {
                throw new Errors.BadRequestException("file required");
            }
            const url = await uploadService.uploadAvatar({
                image: buffer,
                name,
            });
            reply.send({ url });
        },
    });

    fastify.post<{ Params: UploadParams }>("/upload/music/:name", {
        handler: async (req, reply) => {
            const name = req.params.name;
            const data = await req.file();
            const buffer = await data?.toBuffer();
            if (!buffer) {
                throw new Errors.BadRequestException("file required");
            }
            const url = await uploadService.uploadMusic(name, buffer);

            reply.send({ url });
        },
    });
    fastify.setErrorHandler<Error>((error, _req, rep) => {
        if (error instanceof Errors.BaseException) {
            const status: number = getStatus(error); // Unprocessable Entity

            rep.status(status).send({
                error: error.code,
                message: error.message,
                data: error.data,
            });
        } else {
            throw error;
        }
    });
}

function getStatus(error: Errors.BaseException) {
    if (error instanceof Errors.AlreadyExistsException) return 409; // Conflict
    if (error instanceof Errors.BadRequestException) return 400; // Bad Request
    if (error instanceof Errors.NotFoundException) return 404; // Not Found
    if (error instanceof Errors.PermissionDeniedException) return 403; // Forbidden
    if (error instanceof Errors.UnauthorizedException) return 401; // Unauthorized
    if (error instanceof Errors.ValidationFailedException)
        return 422; // Unprocessable Entity
    else throw new Error("not included :/");
}
