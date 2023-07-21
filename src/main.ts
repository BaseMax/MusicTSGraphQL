import "reflect-metadata";
import { container } from "./container";
import fastify from "fastify";
import { ArgumentValidationError, buildSchema } from "type-graphql";
import { AuthResolver } from "./modules/auth/auth.resolver";
import { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo from "@as-integrations/fastify";
import { GqlContext } from "./utils/gql-context";
import { authChecker } from "./authChecker";
import { context } from "./context";
import { GenresResolver } from "./modules/genres/genres.resolver";
import { SingersResolver } from "./modules/singers/singers.resolver";
import { GraphQLError, GraphQLFormattedError } from "graphql";

import { unwrapResolverError } from "@apollo/server/errors";
import { BaseException } from "./errors/base.exception";
import { ValidationFailedException } from "./errors/validation-failed.exception";
import { uploadRoutes } from "./modules/upload/upload.controller";
import { CommentsResolver } from "./modules/comments/comments.resolver";
import { MusicsResolver } from "./modules/musics/musics.resolver";

export function formatError(
    formattedError: GraphQLFormattedError,
    error: unknown
): GraphQLFormattedError {
    let e = unwrapResolverError(error);
    if (e instanceof ArgumentValidationError) {
        e = new ValidationFailedException(e.message, e.validationErrors);
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

async function main() {
    const schema = await buildSchema({
        resolvers: [
            AuthResolver,
            GenresResolver,
            SingersResolver,
            CommentsResolver,
            MusicsResolver,
        ],
        container: { get: (cls) => container.resolve(cls) },
        authChecker: ({ context: { user } }, roles) => authChecker(roles)(user),
        validate: true,
    });

    const app = fastify();
    app.register(uploadRoutes);
    const apollo = new ApolloServer<GqlContext>({
        schema,
        introspection: true,
        plugins: [fastifyApolloDrainPlugin(app)],

        formatError,
    });
    await apollo.start();
    await app.register(fastifyApollo(apollo), { context });

    const url = await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`started on ${url}`);
}

main().catch(console.error);
