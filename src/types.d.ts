import { UserAuthPayload } from "./modules/auth/dto/user.data";

declare module "fastify" {
    interface FastifyRequest {
        user?: UserAuthPayload;
    }
}
