import { IsArray, IsString, IsBoolean, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PermissionDto {
  @ApiProperty({ example: "menu-id-here" })
  @IsString()
  menu_id: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  can_view: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  can_create: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  can_update: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  can_delete: boolean;
}

export class SetPermissionsDto {
  @ApiProperty({ type: [PermissionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
