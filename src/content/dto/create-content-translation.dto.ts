import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContentTranslationDto {
  @ApiProperty({ description: 'Language code (en, th)' })
  @IsString()
  language_code: string;

  @ApiProperty({ description: 'Translated title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Translated content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Translated excerpt' })
  @IsOptional()
  @IsString()
  excerpt?: string;
}
