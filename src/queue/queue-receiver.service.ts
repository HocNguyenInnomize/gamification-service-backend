import { ServiceBusReceiver } from '@azure/service-bus';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Receiver } from 'nestjs-azure-service-bus';

@Injectable()
export class QueueReceiverService implements OnModuleInit {
  constructor(
    @Receiver('test-queue') private readonly receiver: ServiceBusReceiver,
  ) {}
  onModuleInit() {
    this.receiver.subscribe({
      processMessage: async (message) => {
        console.log(`message.body: ${JSON.stringify(message.body)}`);
      },
      processError: async (args) => {
        console.log(
          `Error occurred with ${args.entityPath} within ${args.fullyQualifiedNamespace}: `,
          args.error,
        );
      },
    });
  }
}
