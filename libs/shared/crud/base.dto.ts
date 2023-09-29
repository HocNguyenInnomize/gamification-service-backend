import { Type } from 'class-transformer';

export class BaseModelDto {
  id?: number;

  @Type(() => Date)
  createdAt?: Date;

  createdBy?: number;

  @Type(() => Date)
  updatedAt?: Date;

  updatedBy?: number;

  @Type(() => Date)
  deletedAt?: Date;
}
