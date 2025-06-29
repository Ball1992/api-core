import { Controller, Get, Post, Put, Delete, UseGuards, Param, Body, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { ContentService } from "./content.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { Public } from "../common/decorators/public.decorator";
import { User } from "../common/decorators/user.decorator";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { CreateContentTranslationDto } from "./dto/create-content-translation.dto";

@ApiTags("Contents")
@Controller("contents")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("contents:view")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all contents" })
  @ApiQuery({ name: "lang", required: false, description: "Language code (en, th)" })
  @ApiQuery({ name: "category", required: false, description: "Category ID" })
  @ApiQuery({ name: "status", required: false, description: "Content status" })
  async findAll(
    @Query("lang") lang?: string,
    @Query("category") categoryId?: string,
    @Query("status") status?: string
  ) {
    return this.contentService.findAll({ lang, categoryId, status });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("contents:view")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get content by ID" })
  @ApiQuery({ name: "lang", required: false, description: "Language code (en, th)" })
  async findOne(@Param("id") id: string, @Query("lang") lang?: string) {
    return this.contentService.findOne(id, lang);
  }

  @Get("slug/:slug")
  @Public()
  @ApiOperation({ summary: "Get content by slug (public)" })
  @ApiQuery({ name: "lang", required: false, description: "Language code (en, th)" })
  async findBySlug(@Param("slug") slug: string, @Query("lang") lang?: string) {
    return this.contentService.findBySlug(slug, lang);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("contents:create")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new content" })
  async create(@Body() createContentDto: CreateContentDto, @User() user: any) {
    return this.contentService.create(createContentDto, user);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("contents:update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update content" })
  async update(
    @Param("id") id: string,
    @Body() updateContentDto: UpdateContentDto,
    @User() user: any
  ) {
    return this.contentService.update(id, updateContentDto, user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("contents:delete")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete content" })
  async remove(@Param("id") id: string) {
    return this.contentService.remove(id);
  }

  @Post(":id/translations")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("contents:update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add or update content translation" })
  async upsertTranslation(
    @Param("id") id: string,
    @Body() translationDto: CreateContentTranslationDto,
    @User() user: any
  ) {
    return this.contentService.upsertTranslation(id, translationDto, user);
  }

  @Public()
  @Get("published/list")
  @ApiOperation({ summary: "Get published contents (public)" })
  @ApiQuery({ name: "lang", required: false, description: "Language code (en, th)" })
  @ApiQuery({ name: "category", required: false, description: "Category slug" })
  async findPublished(
    @Query("lang") lang?: string,
    @Query("category") categorySlug?: string
  ) {
    return this.contentService.findPublished({ lang, categorySlug });
  }
}
