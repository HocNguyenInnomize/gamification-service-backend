import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AzureServiceBusModule } from 'nestjs-azure-service-bus';

import { QueueReceiverService } from "./queue-receiver.service";
import { QueueSenderService } from "./queue-sender.service";
import { QueueService } from "./queue.service";

@Module({
  imports: [
    AzureServiceBusModule.forFeature({
      senders: ['test-queue'],
      receivers: ['test-queue'],
    }),
    // AzureServiceBusModule.forFeatureAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     return {
    //       senders: [configService.get("SENDERS_1")],
    //       receivers: [configService.get("RECEIVERS_1")],
    //     };
    //   },
    //   inject: [ConfigService]
    // }),
  ],
  providers:[QueueSenderService, QueueReceiverService, QueueService],
  exports:[QueueSenderService, QueueService]
})
export class QueueModule {}
