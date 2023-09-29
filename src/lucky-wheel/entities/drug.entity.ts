import { Entity, Column } from 'typeorm';

import { BaseModel } from 'libs/shared/crud/base.model';

@Entity('drugs')
export class Drug extends BaseModel {
  @Column({ name: 'generic_name', nullable: true })
  genericName: string;

  @Column({ name: 'brand_name', nullable: true })
  brandName: string;

  @Column({ name: 'medicine_type', nullable: true })
  medicineType: string;
}
