import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateRoleDto {
  @ApiProperty({ example: "Manager" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: "Manager role with limited permissions" })
  @IsOptional()
  @IsString()
  description?: string;
}
