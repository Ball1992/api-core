import { IsString, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class PermissionDto {
  @ApiProperty({ description: 'Can view' })
  @IsBoolean()
  can_view: boolean;

  @ApiProperty({ description: 'Can create' })
  @IsBoolean()
  can_create: boolean;

  @ApiProperty({ description: 'Can update' })
  @IsBoolean()
  can_update: boolean;

  @ApiProperty({ description: 'Can delete' })
  @IsBoolean()
  can_delete: boolean;
}

class MenuPermissionDto {
  @ApiProperty({ description: 'Menu ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Menu name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Menu permissions' })
  @ValidateNested()
  @Type(() => PermissionDto)
  permissions: PermissionDto;

  @ApiProperty({ description: 'Child menus', required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuPermissionDto)
  children?: MenuPermissionDto[];
}

export class UpdatePermissionsFromMenusDto {
  @ApiProperty({ description: 'Role ID' })
  @IsString()
  roleId: string;

  @ApiProperty({ description: 'Menu permissions structure', type: [MenuPermissionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuPermissionDto)
  permissions: MenuPermissionDto[];
}
