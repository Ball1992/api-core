import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
import { CreateLabelTranslationDto } from "./dto/create-label-translation.dto";

@Injectable()
export class LabelService {
  constructor(private prisma: PrismaService) {}

  async create(createLabelDto: CreateLabelDto) {
    const existingLabel = await this.prisma.sys_label.findUnique({
      where: { key: createLabelDto.key },
    });

    if (existingLabel) {
      throw new ConflictException("Label key already exists");
    }

    return this.prisma.sys_label.create({
      data: {
        key: createLabelDto.key,
        default_value: createLabelDto.defaultValue,
        description: createLabelDto.description,
        is_active: createLabelDto.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.sys_label.findMany({
      include: {
        translations: true,
      },
      orderBy: { key: "asc" },
    });
  }

  async findOne(id: string) {
    const label = await this.prisma.sys_label.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    return label;
  }

  async update(id: string, updateLabelDto: UpdateLabelDto) {
    await this.findOne(id);

    if (updateLabelDto.key) {
      const existingLabel = await this.prisma.sys_label.findFirst({
        where: {
          key: updateLabelDto.key,
          NOT: { id },
        },
      });

      if (existingLabel) {
        throw new ConflictException("Label key already exists");
      }
    }

    return this.prisma.sys_label.update({
      where: { id },
      data: {
        key: updateLabelDto.key,
        default_value: updateLabelDto.defaultValue,
        description: updateLabelDto.description,
        is_active: updateLabelDto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Delete translations first
    await this.prisma.sys_label_translation.deleteMany({
      where: { label_id: id },
    });

    // Then delete the label
    return this.prisma.sys_label.delete({
      where: { id },
    });
  }

  async findByLanguage(languageCode: string = "en") {
    const labels = await this.prisma.sys_label.findMany({
      where: { is_active: true },
      include: {
        translations: {
          where: { language_code: languageCode, is_active: true },
        },
      },
    });

    const result = {};
    labels.forEach((label) => {
      const translation = label.translations[0];
      result[label.key] = translation ? translation.value : label.default_value;
    });

    return result;
  }

  async addTranslation(
    labelId: string,
    createTranslationDto: CreateLabelTranslationDto,
  ) {
    await this.findOne(labelId);

    const existingTranslation =
      await this.prisma.sys_label_translation.findFirst({
        where: {
          label_id: labelId,
          language_code: createTranslationDto.languageCode,
        },
      });

    if (existingTranslation) {
      throw new ConflictException(
        "Translation for this language already exists",
      );
    }

    return this.prisma.sys_label_translation.create({
      data: {
        label_id: labelId,
        language_code: createTranslationDto.languageCode,
        value: createTranslationDto.value,
        is_active: createTranslationDto.isActive ?? true,
      },
    });
  }

  async updateTranslation(
    labelId: string,
    translationId: string,
    updateTranslationDto: CreateLabelTranslationDto,
  ) {
    await this.findOne(labelId);

    const translation = await this.prisma.sys_label_translation.findFirst({
      where: {
        id: translationId,
        label_id: labelId,
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
        await this.prisma.sys_label_translation.findFirst({
          where: {
            label_id: labelId,
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

    return this.prisma.sys_label_translation.update({
      where: { id: translationId },
      data: {
        language_code: updateTranslationDto.languageCode,
        value: updateTranslationDto.value,
        is_active: updateTranslationDto.isActive,
      },
    });
  }

  async removeTranslation(labelId: string, translationId: string) {
    await this.findOne(labelId);

    const translation = await this.prisma.sys_label_translation.findFirst({
      where: {
        id: translationId,
        label_id: labelId,
      },
    });

    if (!translation) {
      throw new NotFoundException("Translation not found");
    }

    return this.prisma.sys_label_translation.delete({
      where: { id: translationId },
    });
  }
}
