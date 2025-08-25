import { Module } from "@nestjs/common";
import { PrismaService } from "../adapters/out/persistence/prisma.service";


@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
