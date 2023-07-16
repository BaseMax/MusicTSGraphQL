import "reflect-metadata";
import { container } from "./container";
import fastify from "fastify";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "./modules/auth/auth.resolver";
import { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo from "@as-integrations/fastify";
import { GqlContext } from "./utils/gql-context";
import { authChecker } from "./authChecker";
import { context } from "./context";

async function main() {
    const schema = await buildSchema({
        resolvers: [AuthResolver],
        container: { get: (cls) => container.resolve(cls) },
        authChecker,
    });

    const app = fastify();
    const apollo = new ApolloServer<GqlContext>({
        schema,
        plugins: [fastifyApolloDrainPlugin(app)],
    });
    await apollo.start();
    await app.register(fastifyApollo(apollo), { context });

    const url = await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`started on ${url}`);
}

main().catch(console.error);
