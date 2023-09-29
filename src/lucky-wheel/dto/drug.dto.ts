import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

import { BaseModelDto } from 'libs/shared/crud';

export class CreateDrugDto extends BaseModelDto {
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  brandName: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  genericName: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  medicineType: string;
}

export class UpdateDrugDto extends BaseModelDto {
  @IsString()
  @MaxLength(255)
  brandName: string;

  @IsString()
  @MaxLength(255)
  genericName: string;

  @IsString()
  @MaxLength(255)
  medicineType: string;
}

export class SearchDrugParams {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ default: 10, required: false })
  limit?: number;
}
