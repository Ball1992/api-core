import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { SetPermissionsDto } from "./dto/set-permissions.dto";
import * as ExcelJS from "exceljs";

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(
    createRoleDto: CreateRoleDto,
    createdBy: string,
    createdByName: string,
  ) {
    const existingRole = await this.prisma.sys_role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new BadRequestException("Role with this name already exists");
    }

    return this.prisma.sys_role.create({
      data: {
        ...createRoleDto,
        created_by: createdBy,
        created_by_name: createdByName,
      },
      include: {
        permissions: {
          include: {
            menu: true,
          },
        },
      },
    });
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
          is_active: true,
        }
      : { is_active: true };

    const [roles, total] = await Promise.all([
      this.prisma.sys_role.findMany({
        where,
        skip,
        take: limit,
        include: {
          permissions: {
            include: {
              menu: true,
            },
          },
          _count: {
            select: {
              users: true,
            },
          },
        },
        orderBy: {
          created_date: "desc",
        },
      }),
      this.prisma.sys_role.count({ where }),
    ]);

    return {
      data: roles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const role = await this.prisma.sys_role.findUnique({
      where: { id, is_active: true },
      include: {
        permissions: {
          include: {
            menu: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException("Role not found");
    }

    return role;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
    updatedBy: string,
    updatedByName: string,
  ) {
    await this.findOne(id);

    if (updateRoleDto.name) {
      const existingRole = await this.prisma.sys_role.findFirst({
        where: {
          name: updateRoleDto.name,
          id: { not: id },
        },
      });
      if (existingRole) {
        throw new BadRequestException("Role name already exists");
      }
    }

    return this.prisma.sys_role.update({
      where: { id },
      data: {
        ...updateRoleDto,
        updated_by: updatedBy,
        updated_by_name: updatedByName,
      },
      include: {
        permissions: {
          include: {
            menu: true,
          },
        },
      },
    });
  }

  async remove(id: string, deletedBy: string, deletedByName: string) {
    const _role = await this.findOne(id);

    // Check if role has users
    const userCount = await this.prisma.sys_user.count({
      where: { role_id: id, is_active: true },
    });

    if (userCount > 0) {
      throw new BadRequestException("Cannot delete role that has active users");
    }

    return this.prisma.sys_role.update({
      where: { id },
      data: {
        is_active: false,
        updated_by: deletedBy,
        updated_by_name: deletedByName,
      },
    });
  }

  async setPermissions(
    id: string,
    setPermissionsDto: SetPermissionsDto,
    updatedBy: string,
    updatedByName: string,
  ) {
    await this.findOne(id);

    // Delete existing permissions
    await this.prisma.sys_role_permission.deleteMany({
      where: { role_id: id },
    });

    // Create new permissions
    const permissions = setPermissionsDto.permissions.map((permission) => ({
      role_id: id,
      menu_id: permission.menu_id,
      can_view: permission.can_view,
      can_create: permission.can_create,
      can_update: permission.can_update,
      can_delete: permission.can_delete,
      created_by: updatedBy,
      created_by_name: updatedByName,
    }));

    await this.prisma.sys_role_permission.createMany({
      data: permissions,
    });

    return this.findOne(id);
  }

  async getAllMenusWithPermissions(roleId?: string) {
    // Get all menus
    const menus = await this.prisma.sys_menu.findMany({
      where: { is_active: true },
      include: {
        parent: true,
        children: {
          where: { is_active: true },
          orderBy: { sort_order: 'asc' }
        }
      },
      orderBy: [
        { parent_id: 'asc' },
        { sort_order: 'asc' }
      ]
    });

    // Get permissions for the role if roleId is provided
    let permissions = [];
    if (roleId) {
      permissions = await this.prisma.sys_role_permission.findMany({
        where: { role_id: roleId, is_active: true }
      });
    }

    // Create a map of permissions for quick lookup
    const permissionMap = new Map();
    permissions.forEach(p => {
      permissionMap.set(p.menu_id, {
        can_view: p.can_view,
        can_create: p.can_create,
        can_update: p.can_update,
        can_delete: p.can_delete
      });
    });

    // Structure menus with permissions
    const structuredMenus = menus
      .filter(menu => !menu.parent_id) // Get only top-level menus
      .map(menu => {
        const menuPermission = permissionMap.get(menu.id) || {
          can_view: false,
          can_create: false,
          can_update: false,
          can_delete: false
        };

        return {
          id: menu.id,
          name: menu.name,
          slug: menu.slug,
          icon: menu.icon,
          url: menu.url,
          permissions: menuPermission,
          children: menus
            .filter(child => child.parent_id === menu.id)
            .map(child => {
              const childPermission = permissionMap.get(child.id) || {
                can_view: false,
                can_create: false,
                can_update: false,
                can_delete: false
              };

              return {
                id: child.id,
                name: child.name,
                slug: child.slug,
                icon: child.icon,
                url: child.url,
                permissions: childPermission
              };
            })
        };
      });

    return structuredMenus;
  }

  async updatePermissionsFromMenus(
    roleId: string,
    menuPermissions: any[],
    updatedBy: string,
    updatedByName: string,
  ) {
    // Verify role exists
    await this.findOne(roleId);

    // Delete existing permissions
    await this.prisma.sys_role_permission.deleteMany({
      where: { role_id: roleId },
    });

    // Flatten the menu structure to extract all permissions
    const permissions = [];
    
    const extractPermissions = (menus: any[]) => {
      for (const menu of menus) {
        if (menu.permissions) {
          permissions.push({
            role_id: roleId,
            menu_id: menu.id,
            can_view: menu.permissions.can_view || false,
            can_create: menu.permissions.can_create || false,
            can_update: menu.permissions.can_update || false,
            can_delete: menu.permissions.can_delete || false,
            created_by: updatedBy,
            created_by_name: updatedByName,
          });
        }
        
        // Process children recursively
        if (menu.children && menu.children.length > 0) {
          extractPermissions(menu.children);
        }
      }
    };

    extractPermissions(menuPermissions);

    // Create new permissions
    if (permissions.length > 0) {
      await this.prisma.sys_role_permission.createMany({
        data: permissions,
      });
    }

    // Return updated role with permissions
    return this.findOne(roleId);
  }

  async getPermissions(id: string) {
    await this.findOne(id);

    return this.prisma.sys_role_permission.findMany({
      where: { role_id: id, is_active: true },
      include: {
        menu: true,
      },
    });
  }

  async exportToExcel() {
    const roles = await this.prisma.sys_role.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: {
            users: true,
            permissions: true,
          },
        },
      },
      orderBy: {
        created_date: "desc",
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Roles");

    // Add headers
    worksheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Name", key: "name", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Users Count", key: "users_count", width: 15 },
      { header: "Permissions Count", key: "permissions_count", width: 20 },
      { header: "Created By", key: "created_by_name", width: 20 },
      { header: "Created Date", key: "created_date", width: 20 },
    ];

    // Add data
    roles.forEach((role) => {
      worksheet.addRow({
        id: role.id,
        name: role.name,
        description: role.description,
        users_count: role._count.users,
        permissions_count: role._count.permissions,
        created_by_name: role.created_by_name,
        created_date: role.created_date,
      });
    });

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    return workbook;
  }
}
