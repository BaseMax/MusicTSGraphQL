import "reflect-metadata";
import fastify from "fastify";
import { AuthCheckerFn, buildSchema } from "type-graphql";
import { AuthResolver } from "./modules/auth/auth.resolver";
import { container } from "tsyringe";
import { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo from "@as-integrations/fastify";
import { GqlContext } from "./utils/gql-context";
import { JwtService } from "./modules/auth/jwt.service";
import { GraphQLError } from "graphql";
import { Role } from "./modules/users/user.model";
import { UserAuthPayload } from "./modules/auth/dto/user.data";

async function main() {
    // build TypeGraphQL executable schema
    container.register("jwt-secret", { useValue: process.env.SECRET });
    container.register("jwt-expireTime", { useValue: 3600 * 24 });
    const jwt = container.resolve(JwtService);

    const authChecker: AuthCheckerFn<GqlContext, Role> = (
        { context },
        roles
    ) => {
        if (!context.user) {
            return false;
        }
        if (roles.length === 0) {
            return true;
        }
        if (!roles.includes(context.user.role)) {
            return false;
        }
        return true;
    };
    const schema = await buildSchema({
        resolvers: [AuthResolver],
        container: { get: (cls) => container.resolve(cls) },
        authChecker: authChecker,
    });

    const app = fastify();
    const apollo = new ApolloServer<GqlContext>({
        schema,
        plugins: [fastifyApolloDrainPlugin(app)],
    });
    await apollo.start();
    await app.register(fastifyApollo(apollo), {
        context: async ({ headers }) => {
            const token = headers.authorization;
            if (token) {
                try {
                    const payload = jwt.verify<UserAuthPayload>(token);
                    return {
                        user: payload,
                    };
                } catch {
                    throw new GraphQLError("Authentication error", {
                        extensions: { code: "UNAUTHENTICATED" },
                    });
                }
            } else {
                return {};
            }
        },
    });

    const url = await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`started on ${url}`);
}

main().catch(console.error);
