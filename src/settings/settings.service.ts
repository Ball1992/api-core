import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sys_setting.findMany({
      where: { is_active: true },
      orderBy: { key: "asc" },
    });
  }

  async findByKey(key: string) {
    return this.prisma.sys_setting.findUnique({
      where: { key, is_active: true },
    });
  }

  async getSettings() {
    const settings = await this.findAll();
    const result = {};
    settings.forEach((setting) => {
      result[setting.key] = setting.value;
    });
    return result;
  }
}
