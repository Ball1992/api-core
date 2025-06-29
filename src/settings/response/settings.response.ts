import { ApiProperty } from "@nestjs/swagger";

export class SettingResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  dataType: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  createdByName: string;

  @ApiProperty()
  updatedByName: string;
}

export class SettingListResponse {
  @ApiProperty({ type: [SettingResponse] })
  settings: SettingResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class PublicSettingsResponse {
  @ApiProperty()
  key: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  dataType: string;
}

export class CreateSettingResponse extends SettingResponse {}

export class UpdateSettingResponse extends SettingResponse {}

export class DeleteSettingResponse {
  @ApiProperty()
  message: string;
}

export class SettingsByCategoryResponse {
  @ApiProperty()
  category: string;

  @ApiProperty({ type: [SettingResponse] })
  settings: SettingResponse[];
}
