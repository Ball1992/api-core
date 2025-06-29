import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiPropertyOptional({ example: "username" })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: "Password123!" })
  @IsString()
  @MinLength(6)
  password: string;

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
}
