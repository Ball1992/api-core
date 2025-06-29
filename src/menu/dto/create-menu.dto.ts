import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMenuDto {
  @ApiProperty({ description: "Menu name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Menu slug (unique identifier)" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ description: "Menu URL" })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ description: "Menu icon" })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: "Parent menu ID" })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: "Sort order", default: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number = 0;

  @ApiPropertyOptional({ description: "Is active", default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
