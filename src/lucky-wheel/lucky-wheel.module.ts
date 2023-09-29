import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LuckyWheelService } from './lucky-wheel.service';
import { LuckyWheelController } from './lucky-wheel.controller';
import { Drug } from './entities/drug.entity';
import {GatewayModule} from "../gateway/gateway.module";
import { QueueModule } from "../queue/queue.module";

@Module({
  imports: [TypeOrmModule.forFeature([Drug]), GatewayModule, QueueModule],
  controllers: [LuckyWheelController],
  providers: [LuckyWheelService],
  exports: [LuckyWheelService],
})
export class LuckyWheelModule {}
