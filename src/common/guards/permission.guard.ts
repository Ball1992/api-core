import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      "permissions",
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    // Get user role permissions
    const userPermissions = await this.prisma.sys_role_permission.findMany({
      where: {
        role_id: user.role_id,
        is_active: true,
      },
      include: {
        menu: true,
      },
    });

    // Check if user has required permissions
    for (const permission of requiredPermissions) {
      const [menuSlug, action] = permission.split(":");

      const hasPermission = userPermissions.some((p) => {
        if (p.menu.slug !== menuSlug) return false;

        switch (action) {
          case "view":
            return p.can_view;
          case "create":
            return p.can_create;
          case "update":
            return p.can_update;
          case "delete":
            return p.can_delete;
          default:
            return false;
        }
      });

      if (!hasPermission) {
        throw new ForbiddenException(`Insufficient permissions: ${permission}`);
      }
    }

    return true;
  }
}
