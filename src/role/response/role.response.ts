import { ApiProperty } from "@nestjs/swagger";

export class PermissionResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  menuId: string;

  @ApiProperty()
  canView: boolean;

  @ApiProperty()
  canCreate: boolean;

  @ApiProperty()
  canUpdate: boolean;

  @ApiProperty()
  canDelete: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  menu: any;
}

export class RoleResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  createdByName: string;

  @ApiProperty()
  updatedByName: string;
}

export class RoleListResponse {
  @ApiProperty({ type: [RoleResponse] })
  roles: RoleResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class CreateRoleResponse extends RoleResponse {}

export class UpdateRoleResponse extends RoleResponse {}

export class DeleteRoleResponse {
  @ApiProperty()
  message: string;
}

export class RolePermissionsResponse {
  @ApiProperty({ type: [PermissionResponse] })
  permissions: PermissionResponse[];
}

export class SetPermissionsResponse {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: [PermissionResponse] })
  permissions: PermissionResponse[];
}
