import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { SetPermissionsDto } from "./dto/set-permissions.dto";
import { UpdatePermissionsFromMenusDto } from "./dto/update-permissions-from-menus.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { User } from "../common/decorators/user.decorator";
import { RequestUser } from "../common/interfaces/user.interface";

@ApiTags("Roles")
@ApiBearerAuth()
@Controller("roles")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permissions("roles:create")
  @ApiOperation({ summary: "Create a new role" })
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @User() user: RequestUser,
  ) {
    return this.roleService.create(
      createRoleDto,
      user.id,
      `${user.first_name} ${user.last_name}`,
    );
  }

  @Get()
  @Permissions("roles:view")
  @ApiOperation({ summary: "Get all roles" })
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    return this.roleService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
    );
  }

  @Get(":id")
  @Permissions("roles:view")
  @ApiOperation({ summary: "Get role by ID" })
  async findOne(@Param("id") id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(":id")
  @Permissions("roles:update")
  @ApiOperation({ summary: "Update role" })
  async update(
    @Param("id") id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: RequestUser,
  ) {
    return this.roleService.update(
      id,
      updateRoleDto,
      user.id,
      `${user.first_name} ${user.last_name}`,
    );
  }

  @Delete(":id")
  @Permissions("roles:delete")
  @ApiOperation({ summary: "Delete role" })
  async remove(@Param("id") id: string, @User() user: RequestUser) {
    return this.roleService.remove(
      id,
      user.id,
      `${user.first_name} ${user.last_name}`,
    );
  }

  @Post(":id/permissions")
  @Permissions("roles:update")
  @ApiOperation({ summary: "Set role permissions" })
  async setPermissions(
    @Param("id") id: string,
    @Body() setPermissionsDto: SetPermissionsDto,
    @User() user: RequestUser,
  ) {
    return this.roleService.setPermissions(
      id,
      setPermissionsDto,
      user.id,
      `${user.first_name} ${user.last_name}`,
    );
  }

  @Get(":id/permissions")
  @Permissions("roles:view")
  @ApiOperation({ summary: "Get role permissions" })
  async getPermissions(@Param("id") id: string) {
    return this.roleService.getPermissions(id);
  }

  @Get("menus/permissions")
  @Permissions("roles:view")
  @ApiOperation({ summary: "Get all menus with permissions for a role" })
  async getAllMenusWithPermissions(@Query("roleId") roleId?: string) {
    return this.roleService.getAllMenusWithPermissions(roleId);
  }

  @Post("menus/permissions")
  @Permissions("roles:update")
  @ApiOperation({ summary: "Update all permissions for a role from menu structure" })
  async updatePermissionsFromMenus(
    @Body() updatePermissionsDto: UpdatePermissionsFromMenusDto,
    @User() user: RequestUser,
  ) {
    return this.roleService.updatePermissionsFromMenus(
      updatePermissionsDto.roleId,
      updatePermissionsDto.permissions,
      user.id,
      `${user.first_name} ${user.last_name}`,
    );
  }
}
