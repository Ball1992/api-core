import { ApiProperty } from "@nestjs/swagger";

export class ContentTranslationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentId: string;

  @ApiProperty()
  languageCode: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class ContentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  contentType: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  publishedAt: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [ContentTranslationResponse] })
  translations: ContentTranslationResponse[];

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

export class ContentListResponse {
  @ApiProperty({ type: [ContentResponse] })
  contents: ContentResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class ContentBySlugResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  contentType: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  publishedAt: string;
}

export class CreateContentResponse extends ContentResponse {}

export class UpdateContentResponse extends ContentResponse {}

export class DeleteContentResponse {
  @ApiProperty()
  message: string;
}

export class AddTranslationResponse extends ContentTranslationResponse {}

export class UpdateTranslationResponse extends ContentTranslationResponse {}

export class DeleteTranslationResponse {
  @ApiProperty()
  message: string;
}
