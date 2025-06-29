import { IsEmail, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "admin@jairak.com" })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: "Admin123!" })
  @IsString()
  @MinLength(6)
  password: string;
}
