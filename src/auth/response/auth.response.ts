import { ApiProperty } from "@nestjs/swagger";

export class UserResponse {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'User role information' })
  role: any;
}

export class LoginResponse {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({ type: UserResponse, description: 'User information' })
  user: UserResponse;
}

export class RefreshTokenResponse {
  @ApiProperty({ description: 'New JWT access token' })
  accessToken: string;

  @ApiProperty({ type: UserResponse, description: 'User information' })
  user: UserResponse;
}

export class RegisterResponse {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'User phone number' })
  phoneNumber: string;

  @ApiProperty({ description: 'Login method (local, azure, etc.)' })
  loginMethod: string;

  @ApiProperty({ description: 'Role ID' })
  roleId: string;

  @ApiProperty({ description: 'Role information' })
  role: any;

  @ApiProperty({ description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ description: 'User creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'User last update timestamp' })
  updatedAt: string;
}

export class LogoutResponse {
  @ApiProperty({ description: 'Logout message' })
  message: string;
}

export class ProfileResponse extends UserResponse {
  @ApiProperty({ description: 'User role ID' })
  roleId: string;

  @ApiProperty({ description: 'Login method' })
  loginMethod: string;
}
