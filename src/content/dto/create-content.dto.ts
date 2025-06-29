import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ContentStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived'
}

export class CreateContentDto {
  @ApiProperty({ description: 'Content title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Content slug (URL-friendly)' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Content body' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Content excerpt' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ description: 'Featured image URL' })
  @IsOptional()
  @IsString()
  featured_image?: string;

  @ApiProperty({ description: 'Category ID' })
  @IsString()
  category_id: string;

  @ApiPropertyOptional({ 
    description: 'Content status',
    enum: ContentStatus,
    default: ContentStatus.draft
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ description: 'Publish start date' })
  @IsOptional()
  @IsDateString()
  publish_start_date?: string;

  @ApiPropertyOptional({ description: 'Publish end date' })
  @IsOptional()
  @IsDateString()
  publish_end_date?: string;

  @ApiPropertyOptional({ description: 'Is visible', default: true })
  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;
}
