import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { User } from "../common/decorators/user.decorator";
import { RequestUser } from "../common/interfaces/user.interface";

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permissions("users:create")
  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async create(
    @Body() createUserDto: CreateUserDto,
    @User() user: RequestUser,
  ) {
    return this.userService.create(
      createUserDto,
      user.id,
      `${user.first_name} ${user.last_name}`,
    );
  }

  @Get()
  @Permissions("users:view")
  @ApiOperation({ summary: "Get all users" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "Users retrieved successfully" })
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.userService.findAll(pageNum, limitNum, search);
  }

  @Get("export")
  @Permissions("users:view")
  @ApiOperation({ summary: "Export users to Excel" })
  @ApiResponse({
    status: 200,
    description: "Excel file generated successfully",
  })
  async exportToExcel(@Res() res: Response) {
    const workbook = await this.userService.exportToExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=users-${new Date().toISOString().split("T")[0]}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  @Get(":id")
  @Permissions("users:view")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  @Permissions("users:update")
  @ApiOperation({ summary: "Update user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: RequestUser,
  ) {
    return this.userService.update(
      id,
      updateUserDto,
      user.id,
      `${user.first_name} ${user.last_name}`,
    );
  }

  @Delete(":id")
  @Permissions("users:delete")
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async remove(@Param("id") id: string, @User() user: RequestUser) {
    return this.userService.remove(
      id,
      user.id,
      `${user.first_name} ${user.last_name}`,
    );
  }
}
