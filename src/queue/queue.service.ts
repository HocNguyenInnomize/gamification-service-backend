import {Injectable, Logger} from '@nestjs/common';
const _ = require('lodash');

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor() {}
}
