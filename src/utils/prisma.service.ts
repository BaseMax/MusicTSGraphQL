import { PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
@injectable()
export class PrismaService extends PrismaClient { }
