/* eslint-disable @typescript-eslint/no-unused-vars */
import { Repository, SaveOptions, SelectQueryBuilder, Brackets } from 'typeorm';
import { isEmpty, isArray } from 'lodash';

import { IncludeOption, PagingParams, SearchParams } from './param.interface';
import { BaseModel } from './base.model';
import { ACTION } from './constant.util';

export class BaseCrudService<M extends BaseModel, C = null, U = null, R extends Repository<M> = Repository<M>> {
  protected baseRepo: R;
  protected alias: string;
  protected isSoftDelete: boolean;

  constructor(repository: R, alias: string, isSoftDelete = true) {
    this.baseRepo = repository;
    this.alias = alias;
    this.isSoftDelete = isSoftDelete;
  }

  async create(createDto: C, saveOptions: SaveOptions): Promise<M> {
    const entityObj = await this.populateEntity(createDto, ACTION.CREATE);

    return this.baseRepo.save(entityObj, saveOptions);
  }

  async findAll(searchParams: SearchParams): Promise<any> {
    const builder = this.createQueryBuilder(searchParams);
    await this.populateSearchBuilder(builder, searchParams);
    if (searchParams.keyword) {
      this.setFullTextSearch(searchParams.keyword.trim(), searchParams.searchFields, builder);
    }

    const { limit = 50, offset = 0, all = false }: PagingParams = searchParams.pagingParams;
    if (!all) {
      builder.take(limit).skip(offset);

      return builder.getManyAndCount();
    }

    return builder.getMany();
  }

  async findOne(options: any): Promise<M> {
    return this.baseRepo.findOne(options);
  }

  async findOneById(id): Promise<M> {
    return this.baseRepo.findOneBy({
      id,
    });
  }

  async update(dto: U, saveOptions: SaveOptions): Promise<M> {
    const entityObj = await this.populateEntity(dto, ACTION.UPDATE);

    return this.baseRepo.save(entityObj, saveOptions);
  }

  async partialUpdate(updateConditions: any, updateValue: any): Promise<any> {
    return this.baseRepo.update(updateConditions, updateValue);
  }

  async delete(entity: M): Promise<boolean> {
    if (this.isSoftDelete) {
      await this.baseRepo.softRemove(entity);
    } else {
      await this.baseRepo.remove(entity);
    }

    return true;
  }

  protected populateEntity(dto: any, action: ACTION): Promise<any> | any {
    return this.baseRepo.create(dto);
  }

  protected createQueryBuilder(searchParams: SearchParams): SelectQueryBuilder<M> {
    // create query builder
    const builder = this.baseRepo.createQueryBuilder(this.alias);

    // select fields
    if (searchParams.fields && searchParams.fields.length > 0) {
      const selectedFields = searchParams.fields;
      const columns = (selectedFields || []).map(field => `${this.alias}.${field}`);

      builder.select(columns);
    }

    if (searchParams.include) {
      for (const relation of searchParams.include) {
        this.setJoinRelations(relation, builder);
      }
    }

    if (searchParams.sorts) {
      this.addSortOptions(searchParams, builder);
    }

    return builder;
  }

  protected setJoinRelations(incOption: IncludeOption, builder: SelectQueryBuilder<M>) {
    if (incOption.alias) {
      let relationAlias = incOption.alias;
      const mappingCols = incOption.select;
      const relationAliasArr = relationAlias.split('.');
      let relationPath = `${this.alias}.${relationAlias}`;

      if (relationAliasArr.length === 2) {
        relationPath = relationAlias;
        relationAlias = 'step02' + relationAlias.replace('.', '_');
      }

      const select = (mappingCols || []).map(col => `${relationAlias}.${col}`);
      const relationType = incOption.required ? 'innerJoin' : 'leftJoin';
      const handleRelationSelect = select.length === 0 ? `${relationType}AndSelect` : relationType;

      builder[handleRelationSelect](relationPath, relationAlias);
      builder.addSelect(select);
    }
  }

  protected addSortOptions(searchParams: SearchParams, queryBuilder): SelectQueryBuilder<M> {
    searchParams.sorts.forEach(sort => {
      const { alias, field, order } = sort;

      if (!alias) {
        queryBuilder.addOrderBy(`${this.alias}.${field}`, order);
      }

      const relation = alias;
      if (relation && (searchParams.include || []).find(rel => rel.alias === alias)) {
        queryBuilder.addOrderBy(`${alias}.${field}`, order);
      }
    });

    return queryBuilder;
  }

  protected setFullTextSearch(keyword, selectedFields, builder) {
    if (!isArray(selectedFields)) {
      return true;
    }

    builder.andWhere(
      new Brackets(qb => {
        for (const field of selectedFields) {
          if (!isEmpty(field)) {
            qb.orWhere(`${this.alias}.${field} LIKE :${field}`, {
              [field]: `%${keyword}%`,
            });
          }
        }
      }),
    );

    return true;
  }

  protected async populateSearchBuilder(queryBuilder, searchParams: SearchParams): Promise<SelectQueryBuilder<M>> {
    return Promise.resolve(queryBuilder);
  }
}
