import { ApiProperty } from "@nestjs/swagger";

export class LabelTranslationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  labelId: string;

  @ApiProperty()
  languageCode: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class LabelResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  defaultValue: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [LabelTranslationResponse] })
  translations: LabelTranslationResponse[];

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

export class LabelListResponse {
  @ApiProperty({ type: [LabelResponse] })
  labels: LabelResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class LabelByLanguageResponse {
  @ApiProperty()
  key: string;

  @ApiProperty()
  value: string;
}

export class CreateLabelResponse extends LabelResponse {}

export class UpdateLabelResponse extends LabelResponse {}

export class DeleteLabelResponse {
  @ApiProperty()
  message: string;
}

export class AddTranslationResponse extends LabelTranslationResponse {}

export class UpdateTranslationResponse extends LabelTranslationResponse {}

export class DeleteTranslationResponse {
  @ApiProperty()
  message: string;
}
