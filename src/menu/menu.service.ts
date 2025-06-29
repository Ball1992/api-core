import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { CreateMenuTranslationDto } from "./dto/create-menu-translation.dto";

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    return this.prisma.sys_menu.create({
      data: {
        name: createMenuDto.name,
        slug: createMenuDto.slug,
        url: createMenuDto.url,
        icon: createMenuDto.icon,
        parent_id: createMenuDto.parentId,
        sort_order: createMenuDto.sortOrder ?? 0,
        is_active: createMenuDto.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.sys_menu.findMany({
      where: { parent_id: null },
      include: {
        children: {
          where: { is_active: true },
          orderBy: { sort_order: "asc" },
          include: {
            translations: true,
          },
        },
        translations: true,
      },
      orderBy: { sort_order: "asc" },
    });
  }

  async findOne(id: string) {
    const menu = await this.prisma.sys_menu.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { sort_order: "asc" },
          include: {
            translations: true,
          },
        },
        translations: true,
        parent: true,
      },
    });

    if (!menu) {
      throw new NotFoundException("Menu not found");
    }

    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id);

    return this.prisma.sys_menu.update({
      where: { id },
      data: {
        name: updateMenuDto.name,
        slug: updateMenuDto.slug,
        url: updateMenuDto.url,
        icon: updateMenuDto.icon,
        parent_id: updateMenuDto.parentId,
        sort_order: updateMenuDto.sortOrder,
        is_active: updateMenuDto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Check if menu has children
    const hasChildren = await this.prisma.sys_menu.count({
      where: { parent_id: id },
    });

    if (hasChildren > 0) {
      throw new ConflictException("Cannot delete menu with children");
    }

    // Delete translations first
    await this.prisma.sys_menu_translation.deleteMany({
      where: { menu_id: id },
    });

    // Delete role permissions
    await this.prisma.sys_role_permission.deleteMany({
      where: { menu_id: id },
    });

    // Then delete the menu
    return this.prisma.sys_menu.delete({
      where: { id },
    });
  }

  async findByUserRole(roleId: string) {
    const permissions = await this.prisma.sys_role_permission.findMany({
      where: {
        role_id: roleId,
        is_active: true,
        can_view: true,
      },
      include: {
        menu: {
          include: {
            children: {
              where: { is_active: true },
              orderBy: { sort_order: "asc" },
              include: {
                translations: true,
              },
            },
            translations: true,
          },
        },
      },
    });

    return permissions.map((p) => p.menu).filter((menu) => menu !== null);
  }

  async getNavigation(languageCode: string = "en", roleId?: string) {
    let menus;

    if (roleId) {
      // Get menus based on role permissions
      const permissions = await this.prisma.sys_role_permission.findMany({
        where: {
          role_id: roleId,
          is_active: true,
          can_view: true,
          menu: {
            is_active: true,
            parent_id: null,
          },
        },
        include: {
          menu: {
            include: {
              translations: {
                where: { language_code: languageCode, is_active: true },
              },
            },
          },
        },
      });

      menus = permissions.map((p) => p.menu).filter((menu) => menu !== null);
    } else {
      // Get all active menus
      menus = await this.prisma.sys_menu.findMany({
        where: {
          is_active: true,
          parent_id: null,
        },
        include: {
          translations: {
            where: { language_code: languageCode, is_active: true },
          },
        },
        orderBy: { sort_order: "asc" },
      });
    }

    // Build navigation tree with translations
    const navigation = await Promise.all(
      menus.map(async (menu) => {
        const children = await this.getChildrenWithTranslations(
          menu.id,
          languageCode,
          roleId,
        );
        const translation = menu.translations?.[0];

        return {
          id: menu.id,
          name: translation?.name || menu.name,
          url: menu.url,
          icon: menu.icon,
          children: children,
        };
      }),
    );

    return navigation;
  }

  private async getChildrenWithTranslations(
    parentId: string,
    languageCode: string,
    roleId?: string,
  ) {
    let children;

    if (roleId) {
      const permissions = await this.prisma.sys_role_permission.findMany({
        where: {
          role_id: roleId,
          is_active: true,
          can_view: true,
          menu: {
            is_active: true,
            parent_id: parentId,
          },
        },
        include: {
          menu: {
            include: {
              translations: {
                where: { language_code: languageCode, is_active: true },
              },
            },
          },
        },
      });

      children = permissions.map((p) => p.menu).filter((menu) => menu !== null);
    } else {
      children = await this.prisma.sys_menu.findMany({
        where: {
          is_active: true,
          parent_id: parentId,
        },
        include: {
          translations: {
            where: { language_code: languageCode, is_active: true },
          },
        },
        orderBy: { sort_order: "asc" },
      });
    }

    return Promise.all(
      children.map(async (child) => {
        const subChildren = await this.getChildrenWithTranslations(
          child.id,
          languageCode,
          roleId,
        );
        const translation = child.translations?.[0];

        return {
          id: child.id,
          name: translation?.name || child.name,
          url: child.url,
          icon: child.icon,
          children: subChildren,
        };
      }),
    );
  }

  async addTranslation(
    menuId: string,
    createTranslationDto: CreateMenuTranslationDto,
  ) {
    await this.findOne(menuId);

    const existingTranslation = await this.prisma.sys_menu_translation.findFirst(
      {
        where: {
          menu_id: menuId,
          language_code: createTranslationDto.languageCode,
        },
      },
    );

    if (existingTranslation) {
      throw new ConflictException(
        "Translation for this language already exists",
      );
    }

    return this.prisma.sys_menu_translation.create({
      data: {
        menu_id: menuId,
        language_code: createTranslationDto.languageCode,
        name: createTranslationDto.name,
        is_active: createTranslationDto.isActive ?? true,
      },
    });
  }

  async updateTranslation(
    menuId: string,
    translationId: string,
    updateTranslationDto: CreateMenuTranslationDto,
  ) {
    await this.findOne(menuId);

    const translation = await this.prisma.sys_menu_translation.findFirst({
      where: {
        id: translationId,
        menu_id: menuId,
      },
    });

    if (!translation) {
      throw new NotFoundException("Translation not found");
    }

    if (
      updateTranslationDto.languageCode &&
      updateTranslationDto.languageCode !== translation.language_code
    ) {
      const existingTranslation =
        await this.prisma.sys_menu_translation.findFirst({
          where: {
            menu_id: menuId,
            language_code: updateTranslationDto.languageCode,
            NOT: { id: translationId },
          },
        });

      if (existingTranslation) {
        throw new ConflictException(
          "Translation for this language already exists",
        );
      }
    }

    return this.prisma.sys_menu_translation.update({
      where: { id: translationId },
      data: {
        language_code: updateTranslationDto.languageCode,
        name: updateTranslationDto.name,
        is_active: updateTranslationDto.isActive,
      },
    });
  }

  async removeTranslation(menuId: string, translationId: string) {
    await this.findOne(menuId);

    const translation = await this.prisma.sys_menu_translation.findFirst({
      where: {
        id: translationId,
        menu_id: menuId,
      },
    });

    if (!translation) {
      throw new NotFoundException("Translation not found");
    }

    return this.prisma.sys_menu_translation.delete({
      where: { id: translationId },
    });
  }
}
