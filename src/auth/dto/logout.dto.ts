import { IsString, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class LogoutDto {
  @ApiPropertyOptional({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
