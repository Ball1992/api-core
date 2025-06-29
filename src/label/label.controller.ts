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
import { LabelService } from "./label.service";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
import { CreateLabelTranslationDto } from "./dto/create-label-translation.dto";
import { Public } from "../common/decorators/public.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";

@ApiTags("Labels")
@Controller("labels")
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("labels.create")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new label" })
  async create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelService.create(createLabelDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all labels" })
  async findAll() {
    return this.labelService.findAll();
  }

  @Public()
  @Get("by-language")
  @ApiOperation({ summary: "Get labels by language" })
  @ApiQuery({
    name: "lang",
    required: false,
    type: String,
    description: "Language code (default: en)",
  })
  async findByLanguage(@Query("lang") lang?: string) {
    return this.labelService.findByLanguage(lang);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get label by ID" })
  @ApiParam({ name: "id", description: "Label ID" })
  async findOne(@Param("id") id: string) {
    return this.labelService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("labels.update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update label" })
  @ApiParam({ name: "id", description: "Label ID" })
  async update(
    @Param("id") id: string,
    @Body() updateLabelDto: UpdateLabelDto,
  ) {
    return this.labelService.update(id, updateLabelDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("labels.delete")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete label" })
  @ApiParam({ name: "id", description: "Label ID" })
  async remove(@Param("id") id: string) {
    await this.labelService.remove(id);
  }

  @Post(":id/translations")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("labels.create")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add translation to label" })
  @ApiParam({ name: "id", description: "Label ID" })
  async addTranslation(
    @Param("id") id: string,
    @Body() createTranslationDto: CreateLabelTranslationDto,
  ) {
    return this.labelService.addTranslation(id, createTranslationDto);
  }

  @Patch(":id/translations/:translationId")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("labels.update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update label translation" })
  @ApiParam({ name: "id", description: "Label ID" })
  @ApiParam({ name: "translationId", description: "Translation ID" })
  async updateTranslation(
    @Param("id") id: string,
    @Param("translationId") translationId: string,
    @Body() updateTranslationDto: CreateLabelTranslationDto,
  ) {
    return this.labelService.updateTranslation(
      id,
      translationId,
      updateTranslationDto,
    );
  }

  @Delete(":id/translations/:translationId")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions("labels.delete")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete label translation" })
  @ApiParam({ name: "id", description: "Label ID" })
  @ApiParam({ name: "translationId", description: "Translation ID" })
  async removeTranslation(
    @Param("id") id: string,
    @Param("translationId") translationId: string,
  ) {
    await this.labelService.removeTranslation(id, translationId);
  }
}
