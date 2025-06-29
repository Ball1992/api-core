import { IsEmail, IsString, IsOptional, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: "username" })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: "password123" })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: "John" })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({ example: "Doe" })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({ example: "+1234567890" })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({ example: "https://example.com/avatar.jpg" })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiProperty({ example: "role-id-here" })
  @IsString()
  role_id: string;
}
