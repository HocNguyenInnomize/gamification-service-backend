/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Repository } from 'typeorm';

import { BaseCrudService } from './base-crud.service';
import { BaseModel } from './base.model';
import { ACTION } from './constant.util';
import { DeleteParams, GetEntityParams, SearchEntityParams } from './param.interface';
import { parseDeleteParams, parseGetParams, parseSearchParams } from './param.util';

/**
 * BaseCrudController
 * M: The current entity
 * C: The create DTO
 * U: The update DTO
 * R: The repository
 */
export abstract class BaseCrudController<M extends BaseModel, C, U, R extends Repository<M> = Repository<M>> {
  constructor(private readonly service: BaseCrudService<M, C, U, R>) {}

  protected abstract mapToDto(entity: M, action: ACTION): any;

  @Post()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() createDto: C) {
    const createdEntity = await this.service.create(createDto, { reload: true });

    return this.mapToDto(createdEntity, ACTION.CREATE);
  }

  @Get()
  async findAll(@Query() searchParams: SearchEntityParams): Promise<any> {
    const parsedSearchParams = parseSearchParams(searchParams);
    const searchResult = await this.service.findAll(parsedSearchParams);
    let items;
    let totalCount;

    if (parsedSearchParams.pagingParams.all) {
      items = searchResult;
      totalCount = items.length;
    } else {
      [items, totalCount] = searchResult;
    }

    return {
      statusCode: HttpStatus.OK,
      data: (items || []).map(item => this.mapToDto(item, ACTION.SEARCH)),
      pagination: {
        totalCount,
        page: parsedSearchParams.pagingParams.page,
        limit: parsedSearchParams.pagingParams.limit,
      },
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string, @Query() getParams: GetEntityParams) {
    const parsedGetParams = parseGetParams(getParams);
    const options = {
      where: {
        id,
      },
    } as any;
    if (parsedGetParams.include) {
      options.relations = parsedGetParams.include.map(include => include.alias);
    }

    const entity = await this.service.findOne(options);
    if (!entity) {
      throw new NotFoundException();
    }

    return this.mapToDto(entity, ACTION.READ);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateDto: U) {
    const entity = await this.service.findOneById(id);

    if (!entity) {
      throw new NotFoundException();
    }

    updateDto = { ...entity, ...updateDto };
    const updatedEntity = await this.service.update(updateDto, { reload: true });

    return this.mapToDto(updatedEntity, ACTION.UPDATE);
  }

  @Delete('/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('id') id: string, @Res() res: Response, @Query() deleteParams: DeleteParams) {
    const parsedDeleteParams = parseDeleteParams(deleteParams);
    const options = {
      where: {
        id,
      },
    } as any;
    if (parsedDeleteParams.include && parsedDeleteParams.include.length > 0) {
      options.relations = parsedDeleteParams.include.map(item => item.alias);
    }

    const entity = await this.service.findOne(options);
    if (!entity) {
      throw new NotFoundException();
    }

    await this.service.delete(entity);

    return res.send();
  }
}
