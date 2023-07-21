import { PrismaClient } from "@prisma/client";
import { singleton } from "tsyringe";
@singleton()
export class PrismaService extends PrismaClient {}
