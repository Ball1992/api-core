import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    // Add audit middleware
    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      console.log(
        `Query ${params.model}.${params.action} took ${after - before}ms`,
      );
      return result;
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
