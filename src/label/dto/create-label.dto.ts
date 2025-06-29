import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLabelDto {
  @ApiProperty({ description: "Label key" })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: "Default value" })
  @IsString()
  @IsNotEmpty()
  defaultValue: string;

  @ApiPropertyOptional({ description: "Description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: "Is active", default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
