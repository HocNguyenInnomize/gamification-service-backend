import { Controller, Get } from '@nestjs/common';
import { DAPR_PUB_SUB_JSON } from 'src/shared/helper/decorators';

@Controller('dapr/subscribe')
export class DaprSubscribeController {
  @Get()
  async subscribe(): Promise<string> {
    return JSON.stringify(DAPR_PUB_SUB_JSON);
  }
}
