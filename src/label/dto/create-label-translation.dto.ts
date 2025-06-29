import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLabelTranslationDto {
  @ApiProperty({ description: "Language code" })
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @ApiProperty({ description: "Translation value" })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ description: "Is active", default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
