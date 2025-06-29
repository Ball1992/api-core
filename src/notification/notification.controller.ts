import { Controller, Get, Patch, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { User } from "../common/decorators/user.decorator";
import { RequestUser } from "../common/interfaces/user.interface";

@ApiTags("Notifications")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: "Get user notifications" })
  async findByUser(@User() user: RequestUser) {
    return this.notificationService.findByUser(user.id);
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Mark notification as read" })
  async markAsRead(@Param("id") id: string, @User() user: RequestUser) {
    return this.notificationService.markAsRead(id, user.id);
  }
}
