import "reflect-metadata";
import { container } from "./container";
import fastify from "fastify";
import { buildSchemaSync } from "type-graphql";
import { AuthResolver } from "./modules/auth/auth.resolver";
import { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo from "@as-integrations/fastify";
import { GqlContext } from "./utils/gql-context";
import { authChecker } from "./authChecker";
import { GenresResolver } from "./modules/genres/genres.resolver";
import { SingersResolver } from "./modules/singers/singers.resolver";
import { uploadRoutes } from "./modules/upload/upload.controller";
import { CommentsResolver } from "./modules/comments/comments.resolver";
import { MusicsResolver } from "./modules/musics/musics.resolver";
import { AlbumsResolver } from "./modules/albums/albums.resolver";
import { ArgumentValidationError } from "type-graphql";
import { context } from "./context";
import { GraphQLError, GraphQLFormattedError } from "graphql";

import { unwrapResolverError } from "@apollo/server/errors";
import { BaseException } from "./errors/base.exception";
import { ValidationFailedException } from "./errors/validation-failed.exception";

export function formatError(
    formattedError: GraphQLFormattedError,
    error: unknown
): GraphQLFormattedError {
    let e = unwrapResolverError(error);
    if (e instanceof ArgumentValidationError) {
        console.log(e.validationErrors);
        e = new ValidationFailedException(e.message, e.validationErrors);
        console.dir(e, { depth: null });
    }
    if (e instanceof BaseException) {
        return new GraphQLError(e.message, {
            extensions: {
                code: e.code,
                data: e.data,
            },
        });
    }
    // Generic
    return formattedError;
}

export async function start() {
    const schema = buildSchemaSync({
        resolvers: [
            AuthResolver,
            GenresResolver,
            SingersResolver,
            CommentsResolver,
            MusicsResolver,
            AlbumsResolver,
        ],
        container: { get: (cls) => container.resolve(cls) },
        authChecker: ({ context: { user } }, roles) => authChecker(roles)(user),
        emitSchemaFile: "./src/schema.gql",
        validate: true,
    });

    const app = fastify();
    const apollo = new ApolloServer<GqlContext>({
        schema,
        introspection: true,
        plugins: [fastifyApolloDrainPlugin(app)],
        formatError,
    });

    app.register(uploadRoutes);
    await apollo.start();
    await app.register(fastifyApollo(apollo), { context });

    const url = await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`started on ${url}`);
    return { app, url };
}
