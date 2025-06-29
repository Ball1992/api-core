import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { CreateContentTranslationDto } from "./dto/create-content-translation.dto";

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: { lang?: string; categoryId?: string; status?: string }) {
    const { lang, categoryId, status } = params || {};
    
    const where: any = { is_active: true };
    if (categoryId) where.category_id = categoryId;
    if (status) where.status = status;

    const contents = await this.prisma.mod_content.findMany({
      where,
      include: {
        category: {
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        },
        translations: lang ? {
          where: { language_code: lang }
        } : true,
        creator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      },
      orderBy: { created_date: "desc" },
    });

    // Transform data if language specified
    if (lang) {
      return contents.map(content => {
        const translation = content.translations[0];
        const categoryTranslation = content.category.translations[0];
        
        return {
          ...content,
          title: translation?.title || content.title,
          content: translation?.content || content.content,
          excerpt: translation?.excerpt || content.excerpt,
          category: {
            ...content.category,
            name: categoryTranslation?.name || content.category.name,
            description: categoryTranslation?.description || content.category.description,
            translations: undefined
          },
          translations: undefined
        };
      });
    }

    return contents;
  }

  async findOne(id: string, lang?: string) {
    const content = await this.prisma.mod_content.findFirst({
      where: { id, is_active: true },
      include: {
        category: {
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        },
        translations: lang ? {
          where: { language_code: lang }
        } : true,
        creator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // Transform data if language specified
    if (lang && content.translations.length > 0) {
      const translation = content.translations[0];
      const categoryTranslation = content.category.translations[0];
      
      return {
        ...content,
        title: translation.title || content.title,
        content: translation.content || content.content,
        excerpt: translation.excerpt || content.excerpt,
        category: {
          ...content.category,
          name: categoryTranslation?.name || content.category.name,
          description: categoryTranslation?.description || content.category.description,
          translations: undefined
        },
        translations: undefined
      };
    }

    return content;
  }

  async findBySlug(slug: string, lang?: string) {
    const content = await this.prisma.mod_content.findFirst({
      where: { 
        slug, 
        is_active: true,
        is_visible: true,
        status: 'published'
      },
      include: {
        category: {
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        },
        translations: lang ? {
          where: { language_code: lang }
        } : true
      }
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // Increment view count
    await this.prisma.mod_content.update({
      where: { id: content.id },
      data: { view_count: { increment: 1 } }
    });

    // Transform data if language specified
    if (lang && content.translations.length > 0) {
      const translation = content.translations[0];
      const categoryTranslation = content.category.translations[0];
      
      return {
        ...content,
        title: translation.title || content.title,
        content: translation.content || content.content,
        excerpt: translation.excerpt || content.excerpt,
        category: {
          ...content.category,
          name: categoryTranslation?.name || content.category.name,
          description: categoryTranslation?.description || content.category.description,
          translations: undefined
        },
        translations: undefined
      };
    }

    return content;
  }

  async create(createContentDto: CreateContentDto, user: any) {
    const { slug } = createContentDto;

    // Check if slug already exists
    const existing = await this.prisma.mod_content.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new Error('Content with this slug already exists');
    }

    return this.prisma.mod_content.create({
      data: {
        ...createContentDto,
        created_by: user.id,
        created_by_name: `${user.first_name} ${user.last_name}`,
        updated_by: user.id,
        updated_by_name: `${user.first_name} ${user.last_name}`
      },
      include: {
        category: true,
        translations: true
      }
    });
  }

  async update(id: string, updateContentDto: UpdateContentDto, user: any) {
    const content = await this.prisma.mod_content.findUnique({
      where: { id }
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // Check if slug is being changed and if new slug already exists
    if (updateContentDto.slug && updateContentDto.slug !== content.slug) {
      const existing = await this.prisma.mod_content.findUnique({
        where: { slug: updateContentDto.slug }
      });

      if (existing) {
        throw new Error('Content with this slug already exists');
      }
    }

    return this.prisma.mod_content.update({
      where: { id },
      data: {
        ...updateContentDto,
        updated_by: user.id,
        updated_by_name: `${user.first_name} ${user.last_name}`
      },
      include: {
        category: true,
        translations: true
      }
    });
  }

  async remove(id: string) {
    const content = await this.prisma.mod_content.findUnique({
      where: { id }
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return this.prisma.mod_content.update({
      where: { id },
      data: { is_active: false }
    });
  }

  async upsertTranslation(contentId: string, translationDto: CreateContentTranslationDto, user: any) {
    const content = await this.prisma.mod_content.findUnique({
      where: { id: contentId }
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const existing = await this.prisma.mod_content_translation.findUnique({
      where: {
        content_id_language_code: {
          content_id: contentId,
          language_code: translationDto.language_code
        }
      }
    });

    if (existing) {
      return this.prisma.mod_content_translation.update({
        where: {
          content_id_language_code: {
            content_id: contentId,
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

    return this.prisma.mod_content_translation.create({
      data: {
        ...translationDto,
        content_id: contentId,
        created_by: user.id,
        created_by_name: `${user.first_name} ${user.last_name}`,
        updated_by: user.id,
        updated_by_name: `${user.first_name} ${user.last_name}`
      }
    });
  }

  async findPublished(params?: { lang?: string; categorySlug?: string }) {
    const { lang, categorySlug } = params || {};
    const now = new Date();
    
    const where: any = {
      is_active: true,
      is_visible: true,
      status: "published",
      OR: [
        { publish_start_date: null },
        { publish_start_date: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { publish_end_date: null },
            { publish_end_date: { gte: now } },
          ],
        },
      ],
    };

    if (categorySlug) {
      const category = await this.prisma.mod_category.findUnique({
        where: { slug: categorySlug }
      });
      if (category) {
        where.category_id = category.id;
      }
    }

    const contents = await this.prisma.mod_content.findMany({
      where,
      include: {
        category: {
          include: {
            translations: lang ? {
              where: { language_code: lang }
            } : true
          }
        },
        translations: lang ? {
          where: { language_code: lang }
        } : true,
      },
      orderBy: { created_date: "desc" },
    });

    // Transform data if language specified
    if (lang) {
      return contents.map(content => {
        const translation = content.translations[0];
        const categoryTranslation = content.category.translations[0];
        
        return {
          ...content,
          title: translation?.title || content.title,
          content: translation?.content || content.content,
          excerpt: translation?.excerpt || content.excerpt,
          category: {
            ...content.category,
            name: categoryTranslation?.name || content.category.name,
            description: categoryTranslation?.description || content.category.description,
            translations: undefined
          },
          translations: undefined
        };
      });
    }

    return contents;
  }
}
