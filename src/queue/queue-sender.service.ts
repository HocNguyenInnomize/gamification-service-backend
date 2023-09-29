import { ServiceBusSender } from '@azure/service-bus';
import { Injectable } from '@nestjs/common';
import { Sender } from 'nestjs-azure-service-bus';

@Injectable()
export class QueueSenderService {
  constructor(
    @Sender('test-queue') private readonly sender: ServiceBusSender,
  ) {}
  async sendMessage(body: any) {
    await this.sender.sendMessages({ body });
  }
}
