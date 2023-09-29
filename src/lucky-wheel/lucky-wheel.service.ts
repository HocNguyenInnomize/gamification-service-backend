import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'libs/shared/crud';
import { UtilsService } from 'src/shared/helper/utils.service';
import { Repository } from 'typeorm';

import { CreateDrugDto, SearchDrugParams, UpdateDrugDto } from './dto';
import { Drug } from './entities/drug.entity';

const _ = require('lodash');

@Injectable()
export class LuckyWheelService extends BaseCrudService<Drug, CreateDrugDto, UpdateDrugDto, Repository<Drug>> {
  constructor(
    @InjectRepository(Drug)
    private readonly drugsRepository: Repository<Drug>,
    private readonly utilsService: UtilsService,
  ) {
    super(drugsRepository, 'drugs');
  }

  async GetDrugsByConditions(searchParams: SearchDrugParams) {
    const searchResult = await this.drugsRepository.query(
      `SELECT drugs.brand_name AS'genericName'FROM drugs WHERE drugs.brand_name LIKE'%${
        searchParams.name
      }%'AND drugs.deleted_at IS NULL GROUP BY drugs.brand_name UNION SELECT drugs.generic_name AS'genericName' FROM drugs WHERE drugs.generic_name LIKE'%${
        searchParams.name
      }%'AND drugs.deleted_at IS NULL GROUP BY drugs.generic_name ORDER BY genericName ASC LIMIT ${
        searchParams.limit || 5
      };`,
    );

    return {
      statusCode: HttpStatus.OK,
      data: searchResult || [],
    };
  }
}
