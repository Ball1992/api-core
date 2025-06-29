import { ApiProperty } from "@nestjs/swagger";

export class NotificationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  readAt: string;

  @ApiProperty()
  data: any;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class NotificationListResponse {
  @ApiProperty({ type: [NotificationResponse] })
  notifications: NotificationResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  unreadCount: number;
}

export class CreateNotificationResponse extends NotificationResponse {}

export class MarkAsReadResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  updatedCount: number;
}

export class MarkAllAsReadResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  updatedCount: number;
}

export class DeleteNotificationResponse {
  @ApiProperty()
  message: string;
}

export class NotificationStatsResponse {
  @ApiProperty()
  totalNotifications: number;

  @ApiProperty()
  unreadNotifications: number;

  @ApiProperty()
  readNotifications: number;

  @ApiProperty()
  notificationsByType: any;
}
