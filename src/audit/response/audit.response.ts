import { ApiProperty } from "@nestjs/swagger";

export class AuditResponse {
  @ApiProperty({ description: 'Audit log ID' })
  id: string;

  @ApiProperty({ description: 'User ID who performed the action' })
  userId: string;

  @ApiProperty({ description: 'User email' })
  userEmail: string;

  @ApiProperty({ description: 'User name' })
  userName: string;

  @ApiProperty({ description: 'Action performed' })
  action: string;

  @ApiProperty({ description: 'Entity type' })
  entity: string;

  @ApiProperty({ description: 'Entity ID' })
  entityId: string;

  @ApiProperty({ description: 'Old value before change', required: false })
  oldValue: any;

  @ApiProperty({ description: 'New value after change', required: false })
  newValue: any;

  @ApiProperty({ description: 'IP address of the user' })
  ipAddress: string;

  @ApiProperty({ description: 'User agent string' })
  userAgent: string;

  @ApiProperty({ description: 'Timestamp of the action' })
  createdAt: string;
}

export class AuditListResponse {
  @ApiProperty({ type: [AuditResponse], description: 'List of audit logs' })
  audits: AuditResponse[];

  @ApiProperty({ description: 'Total number of audit logs' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}

export class AuditByEntityResponse {
  @ApiProperty({ description: 'Entity type' })
  entity: string;

  @ApiProperty({ description: 'Entity ID' })
  entityId: string;

  @ApiProperty({ type: [AuditResponse], description: 'List of audit logs for this entity' })
  audits: AuditResponse[];
}

export class AuditByUserResponse {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'User email' })
  userEmail: string;

  @ApiProperty({ description: 'User name' })
  userName: string;

  @ApiProperty({ type: [AuditResponse], description: 'List of audit logs for this user' })
  audits: AuditResponse[];
}

export class AuditStatsResponse {
  @ApiProperty({ description: 'Total number of audit logs' })
  totalAudits: number;

  @ApiProperty({ description: 'Audit logs grouped by action' })
  auditsByAction: any;

  @ApiProperty({ description: 'Audit logs grouped by entity' })
  auditsByEntity: any;

  @ApiProperty({ description: 'List of most active users', type: [Object] })
  mostActiveUsers: any[];

  @ApiProperty({ type: [AuditResponse], description: 'Recent audit activities' })
  recentActivities: AuditResponse[];
}

export class ExportAuditsResponse {
  @ApiProperty({ description: 'Name of the exported file' })
  fileName: string;

  @ApiProperty({ description: 'Path to the exported file' })
  filePath: string;

  @ApiProperty({ description: 'Total number of records exported' })
  totalRecords: number;
}
