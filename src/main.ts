import "reflect-metadata";
import fastify, {FastifyRegisterOptions} from "fastify";
import mercurius, {MercuriusOptions} from "mercurius";
import { buildSchema } from 'type-graphql'
import { AuthResolver } from "./modules/auth/auth.resolver";


async function main() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [AuthResolver],
  });

  const app = fastify();

  const opts: FastifyRegisterOptions<MercuriusOptions> = {
    schema,
    graphiql: true
  }
  app.register(mercurius, opts);
  console.log("starting");

  app.listen({ port: 3000 });
}

main().catch(console.error);
