import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', {
    nullable: true,
    name: 'created_by',
  })
  createdBy: number | null;

  @CreateDateColumn({
    nullable: true,
    name: 'created_at',
    type: 'datetime',
  })
  createdAt: Date;

  @Column('int', {
    nullable: true,
    name: 'updated_by',
  })
  updatedBy: number | null;

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
    name: 'deleted_at',
    type: 'datetime',
  })
  deletedAt: Date;
}
