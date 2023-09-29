import { Repository } from 'typeorm';
import {Controller, Get, HttpStatus, Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ACTION, BaseCrudController } from 'libs/shared/crud';

import { LuckyWheelService } from './lucky-wheel.service';
import { CreateDrugDto, SearchDrugParams, UpdateDrugDto } from './dto';
import { Drug } from './entities/drug.entity';
import { QueueSenderService } from "../queue/queue-sender.service";

@ApiTags('Drugs')
@Controller('drugs')
export class LuckyWheelController extends BaseCrudController<Drug, CreateDrugDto, UpdateDrugDto, Repository<Drug>> {
  constructor(private readonly drugsService: LuckyWheelService,
              private readonly queueSenderService: QueueSenderService) {
    super(drugsService);
  }

  @Get('append-message-to-queue')
  async AddInterval(): Promise<any> {
    const promiseArray = [];
    for (let i = 0; i < 100; i++) {
      promiseArray.push(this.queueSenderService.sendMessage({
        success: true,
        action: "add message",
        id: i
      }));
    }
    await Promise.all(promiseArray);
  }

  protected mapToDto(dto: Drug, action: ACTION) {
    return dto;
  }
}
