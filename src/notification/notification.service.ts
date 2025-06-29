import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.sys_notification.findMany({
      where: { user_id: userId, is_active: true },
      orderBy: { created_date: "desc" },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.sys_notification.update({
      where: { id, user_id: userId },
      data: { is_read: true, read_date: new Date() },
    });
  }

  async create(data: {
    type: "info" | "warning" | "error" | "success";
    title: string;
    body: string;
    user_id: string;
  }) {
    return this.prisma.sys_notification.create({
      data: {
        type: data.type,
        title: data.title,
        body: data.body,
        user_id: data.user_id,
      },
    });
  }
}
