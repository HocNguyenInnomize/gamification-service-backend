import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';

import { LuckyWheelService } from './lucky-wheel/lucky-wheel.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly drugsService: LuckyWheelService, private readonly httpService: HttpService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  // @Timeout(5000)
  async handleCron() {
    this.logger.debug('Called once after 5 seconds');
  }
}
