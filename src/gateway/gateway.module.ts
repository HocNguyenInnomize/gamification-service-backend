import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";

import { AppGateway } from './app.gateway';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('EXPIRES_TIME') },
      }),
    }),
  ],
  exports: [AppGateway],
  providers: [AppGateway],
  controllers: [],
})
export class GatewayModule {}
