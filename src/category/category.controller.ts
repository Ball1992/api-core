import { Controller, Get, Post, Put, Delete, UseGuards, Param, Body, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { Public } from "../common/decorators/public.decorator";
import { User } from "../common/decorators/user.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryTranslationDto } from "./dto/create-category-translation.dto";

@ApiTags("Categories")
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("categories:view")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all categories" })
  @ApiQuery({ name: "lang", required: false, description: "Language code (en, th)" })
  async findAll(@Query("lang") lang?: string) {
    return this.categoryService.findAll(lang);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("categories:view")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get category by ID" })
  @ApiQuery({ name: "lang", required: false, description: "Language code (en, th)" })
  async findOne(@Param("id") id: string, @Query("lang") lang?: string) {
    return this.categoryService.findOne(id, lang);
  }

  @Get("slug/:slug")
  @Public()
  @ApiOperation({ summary: "Get category by slug (public)" })
  @ApiQuery({ name: "lang", required: false, description: "Language code (en, th)" })
  async findBySlug(@Param("slug") slug: string, @Query("lang") lang?: string) {
    return this.categoryService.findBySlug(slug, lang);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("categories:create")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new category" })
  async create(@Body() createCategoryDto: CreateCategoryDto, @User() user: any) {
    return this.categoryService.create(createCategoryDto, user);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("categories:update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update category" })
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: any
  ) {
    return this.categoryService.update(id, updateCategoryDto, user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("categories:delete")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete category" })
  async remove(@Param("id") id: string) {
    return this.categoryService.remove(id);
  }

  @Post(":id/translations")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("categories:update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add or update category translation" })
  async upsertTranslation(
    @Param("id") id: string,
    @Body() translationDto: CreateCategoryTranslationDto,
    @User() user: any
  ) {
    return this.categoryService.upsertTranslation(id, translationDto, user);
  }

  @Public()
  @Get("public/list")
  @ApiOperation({ summary: "Get active categories (public)" })
  @ApiQuery({ name: "lang", required: false, description: "Language code (en, th)" })
  async findPublic(@Query("lang") lang?: string) {
    return this.categoryService.findPublic(lang);
  }
}
