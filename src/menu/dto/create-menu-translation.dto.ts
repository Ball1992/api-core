import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMenuTranslationDto {
  @ApiProperty({ description: "Language code" })
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @ApiProperty({ description: "Menu name in this language" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: "Is active", default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
