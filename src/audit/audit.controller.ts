import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { AuditService } from "./audit.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";

@ApiTags("Audit")
@Controller("audit")
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("logs")
  @Permissions("audit-logs:view")
  @ApiOperation({ summary: "Get audit logs" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.auditService.findAll(pageNum, limitNum);
  }

  @Get("activity")
  @Permissions("audit-logs:view")
  @ApiOperation({ summary: "Get activity logs" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async findActivityLogs(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.auditService.findActivityLogs(pageNum, limitNum);
  }
}
