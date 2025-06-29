import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryTranslationDto } from "./dto/create-category-translation.dto";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang?: string) {
    const categories = await this.prisma.mod_category.findMany({
      where: { is_active: true },
      include: {
        parent: true,
        children: {
          where: { is_active: true },
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        },
        translations: lang ? {
          where: { language_code: lang }
        } : true,
        contents: {
          where: { is_active: true },
          select: { id: true }
        }
      },
      orderBy: [
        { parent_id: 'asc' },
        { sort_order: 'asc' },
        { name: 'asc' }
      ]
    });

    // Transform data if language specified
    if (lang) {
      return categories.map(category => {
        const translation = category.translations[0];
        
        return {
          ...category,
          name: translation?.name || category.name,
          description: translation?.description || category.description,
          children: category.children.map(child => {
            const childTranslation = child.translations[0];
            return {
              ...child,
              name: childTranslation?.name || child.name,
              description: childTranslation?.description || child.description,
              translations: undefined
            };
          }),
          translations: undefined,
          content_count: category.contents.length
        };
      });
    }

    return categories.map(category => ({
      ...category,
      content_count: category.contents.length
    }));
  }

  async findOne(id: string, lang?: string) {
    const category = await this.prisma.mod_category.findFirst({
      where: { id, is_active: true },
      include: {
        parent: {
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        },
        children: {
          where: { is_active: true },
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        },
        translations: lang ? {
          where: { language_code: lang }
        } : true,
        contents: {
          where: { is_active: true },
          select: { id: true }
        }
      }
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Transform data if language specified
    if (lang && category.translations.length > 0) {
      const translation = category.translations[0];
      const parentTranslation = category.parent?.translations?.[0];
      
      return {
        ...category,
        name: translation.name || category.name,
        description: translation.description || category.description,
        parent: category.parent ? {
          ...category.parent,
          name: parentTranslation?.name || category.parent.name,
          description: parentTranslation?.description || category.parent.description,
          translations: undefined
        } : null,
        children: category.children.map(child => {
          const childTranslation = child.translations[0];
          return {
            ...child,
            name: childTranslation?.name || child.name,
            description: childTranslation?.description || child.description,
            translations: undefined
          };
        }),
        translations: undefined,
        content_count: category.contents.length
      };
    }

    return {
      ...category,
      content_count: category.contents.length
    };
  }

  async findBySlug(slug: string, lang?: string) {
    const category = await this.prisma.mod_category.findFirst({
      where: { slug, is_active: true },
      include: {
        parent: {
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        },
        children: {
          where: { is_active: true },
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        },
        translations: lang ? {
          where: { language_code: lang }
        } : true,
        contents: {
          where: { 
            is_active: true,
            is_visible: true,
            status: 'published'
          },
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        }
      }
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Transform data if language specified
    if (lang) {
      const translation = category.translations[0];
      const parentTranslation = category.parent?.translations?.[0];
      
      return {
        ...category,
        name: translation?.name || category.name,
        description: translation?.description || category.description,
        parent: category.parent ? {
          ...category.parent,
          name: parentTranslation?.name || category.parent.name,
          description: parentTranslation?.description || category.parent.description,
          translations: undefined
        } : null,
        children: category.children.map(child => {
          const childTranslation = child.translations[0];
          return {
            ...child,
            name: childTranslation?.name || child.name,
            description: childTranslation?.description || child.description,
            translations: undefined
          };
        }),
        contents: category.contents.map(content => {
          const contentTranslation = content.translations[0];
          return {
            ...content,
            title: contentTranslation?.title || content.title,
            excerpt: contentTranslation?.excerpt || content.excerpt,
            translations: undefined
          };
        }),
        translations: undefined
      };
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto, user: any) {
    const { slug } = createCategoryDto;

    // Check if slug already exists
    const existing = await this.prisma.mod_category.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new Error('Category with this slug already exists');
    }

    return this.prisma.mod_category.create({
      data: {
        ...createCategoryDto,
        created_by: user.id,
        created_by_name: `${user.first_name} ${user.last_name}`,
        updated_by: user.id,
        updated_by_name: `${user.first_name} ${user.last_name}`
      },
      include: {
        parent: true,
        children: true,
        translations: true
      }
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: any) {
    const category = await this.prisma.mod_category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if slug is being changed and if new slug already exists
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existing = await this.prisma.mod_category.findUnique({
        where: { slug: updateCategoryDto.slug }
      });

      if (existing) {
        throw new Error('Category with this slug already exists');
      }
    }

    return this.prisma.mod_category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        updated_by: user.id,
        updated_by_name: `${user.first_name} ${user.last_name}`
      },
      include: {
        parent: true,
        children: true,
        translations: true
      }
    });
  }

  async remove(id: string) {
    const category = await this.prisma.mod_category.findUnique({
      where: { id },
      include: {
        children: { where: { is_active: true } },
        contents: { where: { is_active: true } }
      }
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.children.length > 0) {
      throw new Error('Cannot delete category with active subcategories');
    }

    if (category.contents.length > 0) {
      throw new Error('Cannot delete category with active contents');
    }

    return this.prisma.mod_category.update({
      where: { id },
      data: { is_active: false }
    });
  }

  async upsertTranslation(categoryId: string, translationDto: CreateCategoryTranslationDto, user: any) {
    const category = await this.prisma.mod_category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const existing = await this.prisma.mod_category_translation.findUnique({
      where: {
        category_id_language_code: {
          category_id: categoryId,
          language_code: translationDto.language_code
        }
      }
    });

    if (existing) {
      return this.prisma.mod_category_translation.update({
        where: {
          category_id_language_code: {
            category_id: categoryId,
            language_code: translationDto.language_code
          }
        },
        data: {
          ...translationDto,
          updated_by: user.id,
          updated_by_name: `${user.first_name} ${user.last_name}`
        }
      });
    }

    return this.prisma.mod_category_translation.create({
      data: {
        ...translationDto,
        category_id: categoryId,
        created_by: user.id,
        created_by_name: `${user.first_name} ${user.last_name}`,
        updated_by: user.id,
        updated_by_name: `${user.first_name} ${user.last_name}`
      }
    });
  }

  async findPublic(lang?: string) {
    const categories = await this.prisma.mod_category.findMany({
      where: { 
        is_active: true,
        parent_id: null // Only top-level categories
      },
      include: {
        children: {
          where: { is_active: true },
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true,
            contents: {
              where: { 
                is_active: true,
                is_visible: true,
                status: 'published'
              },
              select: { id: true }
            }
          },
          orderBy: [
            { sort_order: 'asc' },
            { name: 'asc' }
          ]
        },
        translations: lang ? {
          where: { language_code: lang }
        } : true,
        contents: {
          where: { 
            is_active: true,
            is_visible: true,
            status: 'published'
          },
          select: { id: true }
        }
      },
      orderBy: [
        { sort_order: 'asc' },
        { name: 'asc' }
      ]
    });

    // Transform data if language specified
    if (lang) {
      return categories.map(category => {
        const translation = category.translations[0];
        
        return {
          id: category.id,
          name: translation?.name || category.name,
          slug: category.slug,
          description: translation?.description || category.description,
          content_count: category.contents.length,
          children: category.children.map(child => {
            const childTranslation = child.translations[0];
            return {
              id: child.id,
              name: childTranslation?.name || child.name,
              slug: child.slug,
              description: childTranslation?.description || child.description,
              content_count: child.contents.length
            };
          })
        };
      });
    }

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      content_count: category.contents.length,
      children: category.children.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        content_count: child.contents.length
      }))
    }));
  }
}
