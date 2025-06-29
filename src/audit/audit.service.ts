import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.sys_audit_log.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: { changed_date: "desc" },
      }),
      this.prisma.sys_audit_log.count(),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findActivityLogs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.sys_log_activity.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: { created_date: "desc" },
      }),
      this.prisma.sys_log_activity.count(),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
