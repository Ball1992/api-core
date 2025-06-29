import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { CreateMenuTranslationDto } from "./dto/create-menu-translation.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { User } from "../common/decorators/user.decorator";
import { RequestUser } from "../common/interfaces/user.interface";
import { Public } from "../common/decorators/public.decorator";

@ApiTags("Menu")
@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("menu.create")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new menu" })
  async create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all menus" })
  async findAll() {
    return this.menuService.findAll();
  }

  @Get("navigation")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get navigation menu by language" })
  @ApiQuery({
    name: "lang",
    required: false,
    type: String,
    description: "Language code (default: en)",
  })
  async getNavigation(
    @Query("lang") lang?: string,
    @User() user?: RequestUser,
  ) {
    return this.menuService.getNavigation(lang || "en", user?.role_id);
  }

  @Public()
  @Get("navigation/public")
  @ApiOperation({ summary: "Get public navigation menu by language" })
  @ApiQuery({
    name: "lang",
    required: false,
    type: String,
    description: "Language code (default: en)",
  })
  async getPublicNavigation(@Query("lang") lang?: string) {
    return this.menuService.getNavigation(lang || "en");
  }

  @Get("user")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get menus for current user role" })
  async findByUserRole(@User() user: RequestUser) {
    return this.menuService.findByUserRole(user.role_id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get menu by ID" })
  @ApiParam({ name: "id", description: "Menu ID" })
  async findOne(@Param("id") id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("menu.update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update menu" })
  @ApiParam({ name: "id", description: "Menu ID" })
  async update(@Param("id") id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("menu.delete")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete menu" })
  @ApiParam({ name: "id", description: "Menu ID" })
  async remove(@Param("id") id: string) {
    await this.menuService.remove(id);
  }

  @Post(":id/translations")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("menu.create")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add translation to menu" })
  @ApiParam({ name: "id", description: "Menu ID" })
  async addTranslation(
    @Param("id") id: string,
    @Body() createTranslationDto: CreateMenuTranslationDto,
  ) {
    return this.menuService.addTranslation(id, createTranslationDto);
  }

  @Patch(":id/translations/:translationId")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("menu.update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update menu translation" })
  @ApiParam({ name: "id", description: "Menu ID" })
  @ApiParam({ name: "translationId", description: "Translation ID" })
  async updateTranslation(
    @Param("id") id: string,
    @Param("translationId") translationId: string,
    @Body() updateTranslationDto: CreateMenuTranslationDto,
  ) {
    return this.menuService.updateTranslation(
      id,
      translationId,
      updateTranslationDto,
    );
  }

  @Delete(":id/translations/:translationId")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("menu.delete")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete menu translation" })
  @ApiParam({ name: "id", description: "Menu ID" })
  @ApiParam({ name: "translationId", description: "Translation ID" })
  async removeTranslation(
    @Param("id") id: string,
    @Param("translationId") translationId: string,
  ) {
    await this.menuService.removeTranslation(id, translationId);
  }
}
