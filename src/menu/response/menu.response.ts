import { ApiProperty } from "@nestjs/swagger";

export class MenuTranslationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  menuId: string;

  @ApiProperty()
  languageCode: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class MenuResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  parentId: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [MenuTranslationResponse] })
  translations: MenuTranslationResponse[];

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

export class MenuListResponse {
  @ApiProperty({ type: [MenuResponse] })
  menus: MenuResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class NavigationItemResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  icon: string;

  @ApiProperty({ type: [NavigationItemResponse] })
  children: NavigationItemResponse[];
}

export class NavigationResponse {
  @ApiProperty({ type: [NavigationItemResponse] })
  navigation: NavigationItemResponse[];
}

export class CreateMenuResponse extends MenuResponse {}

export class UpdateMenuResponse extends MenuResponse {}

export class DeleteMenuResponse {
  @ApiProperty()
  message: string;
}

export class AddTranslationResponse extends MenuTranslationResponse {}

export class UpdateTranslationResponse extends MenuTranslationResponse {}

export class DeleteTranslationResponse {
  @ApiProperty()
  message: string;
}
