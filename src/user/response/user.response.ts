import { ApiProperty } from "@nestjs/swagger";

export class RoleResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isActive: boolean;
}

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  loginMethod: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty({ type: RoleResponse })
  role: RoleResponse;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  lastLoginDate: string;

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

export class UserListResponse {
  @ApiProperty({ type: [UserResponse] })
  users: UserResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class CreateUserResponse extends UserResponse {}

export class UpdateUserResponse extends UserResponse {}

export class DeleteUserResponse {
  @ApiProperty()
  message: string;
}

export class ExportUsersResponse {
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  filePath: string;

  @ApiProperty()
  totalRecords: number;
}
