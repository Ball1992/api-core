import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryTranslationDto {
  @ApiProperty({ description: 'Language code (en, th)' })
  @IsString()
  language_code: string;

  @ApiProperty({ description: 'Translated name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Translated description' })
  @IsOptional()
  @IsString()
  description?: string;
}
