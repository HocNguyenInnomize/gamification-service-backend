import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import * as fs from 'fs';
import * as path from 'path';

import { AppController } from './app.controller';
import { HelperModule } from './shared/helper/helper.module';
import { CommonModule } from './common/common.module';
import { configFileName, configuration } from './config';
import { Drug } from './lucky-wheel/entities/drug.entity';
import { TasksService } from './tasks.service';
import { LuckyWheelModule } from './lucky-wheel/lucky-wheel.module';
import { DaprRequestParserService } from './common/daprRequestParser.service';
import { DaprSubscribeController } from './startup/registerSubscribers';
import { QueueModule } from './queue/queue.module';
import { GatewayModule } from "./gateway/gateway.module";
import { AzureServiceBusModule } from "./azure-service-bus/azure-service-bus.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: configFileName(),
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        timezone: 'Z',
        entities: [Drug],
        logging: true,
        ssl: {
          ca: fs.readFileSync(path.resolve(__dirname, '../BaltimoreCyberTrustRoot.crt.pem')),
        },
        // ssl: undefined
      }),
    }),
    AzureServiceBusModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          connectionString: configService.get("AZURE_SERVICE_BUS_CONNECTION_STRING"),
        };
      },
      inject: [ConfigService],
    }),
    HelperModule,
    CommonModule,
    HttpModule,
    ScheduleModule.forRoot(),
    LuckyWheelModule,
    QueueModule,
    GatewayModule,
  ],
  controllers: [AppController, DaprSubscribeController],
  providers: [TasksService, DaprRequestParserService],
})
export class AppModule {}
