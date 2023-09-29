import { Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { DaprPubSubSubscribe } from './shared/helper/decorators';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Get()
  async ping() {
    return 'pong';
  }

  @Get('diagnostic/liveness')
  async healtcheck() {
    return 'Success';
  }

  @DaprPubSubSubscribe('diagnostic/handle-health-event', 'health-dapr-event')
  @Post('diagnostic/handle-health-event')
  async HandleHealthEvent(@Req() req) {
    const { message } = req.body.data;
    console.log(`Compliance service health-dapr-event: ${message}`);
  }
}
